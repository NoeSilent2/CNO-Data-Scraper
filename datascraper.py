import json
import regex
import tqdm
import sqlite3
import glob
import os
import math
from pathlib import Path


class DataScraper:
	def __init__(self, directory_paths):
		self.directory_paths = directory_paths
		
		
		self.pokemon_categories = {}
		with open('species_categories.json', 'r', encoding='utf-8') as file:
				self.pokemon_categories = json.load(file)
		with open('fakemon_categories.json', 'r', encoding='utf-8') as file:
				self.pokemon_categories = self.pokemon_categories | json.load(file)
				
		self.lang_dict = {}
		self.tag_dict = {}
		self.additions_dict = {}
		self.fossil_dict = {}
		
		self.fakeforms_table = []
		self.fakemon_table = []
		self.fossil_table = []
		self.pokemon_table = []
		self.pokemon_dict = {}
		
		self.ability_dict = {}
		
		self.move_data = []
		self.move_dict = {}
		
		self.spawn_data = {}
		
	
	# ----------------------------------------------------------------------------------------
	# -                                   Helper functions                                   -
	# ----------------------------------------------------------------------------------------
	
	def calculate_hp_low_high(self, base, level):
		low = math.floor(((2*base)*level)/100)+level+10
		high = math.floor((((2*base)+94)*level)/100)+level+10
		return f"{low} - {high}"
	
	def calculate_stat_low_high(self, base, level):
		low = math.floor((math.floor(((2*base)*level)/100)+5)*0.9)
		high = math.floor((math.floor((((2*base)+94)*level)/100)+5)*1.1)
		return f"{low} - {high}"
	
	def camelcase_to_space(self, string):
		def add_space(match):
			return f" {match.group(0)}"
		
		return regex.sub(r'(?<!a-z)[A-Z](?!a-z)', add_space, string)
	
	def merge_dictionaries(self, old, new):
		for key, newval in new.items():
			oldval = old.get(key)
			if oldval:
				if isinstance(oldval, list) and isinstance(newval, list):
					if key != "moves":
						for entry in oldval:
							newval.append(entry)
				elif isinstance(oldval, dict) and isinstance(newval, dict):
					for key2, val in newval.items():
						oldval[key2] = val
					newval = oldval
			old[key] = newval
		return old
	
	def safe_get(self, data, key, default=None):
		# Get a dictionary value from what might not be a dictionary
		if isinstance(data, dict):
			return data.get(key, default)
		return default
	
	# ----------------------------------------------------------------------------------------
	# -                                     File loading                                     -
	# ----------------------------------------------------------------------------------------
	
	# Loads all files in a folder that end in the given fileid
	def load_shallow_files(self, pathid, fileid):
		return_files = glob.glob(os.path.join(self.directory_paths[pathid], fileid))
		
		if not return_files:
			tqdm.tqdm.write(f"No files found in {self.directory_paths[pathid]}")
			return False
		
		tqdm.tqdm.write(f"Found {len(return_files)} in {self.directory_paths[pathid]}")
		return return_files
	
	# Loads all files from the folders within the given folder that also meet the fileid critera
	def load_deep_files(self, pathid, fileid):
		return_files = glob.glob(os.path.join(self.directory_paths[pathid], '*', fileid))
		
		if not return_files:
			tqdm.tqdm.write(f"No files found in {self.directory_paths[pathid]}")
			return False
		
		tqdm.tqdm.write(f"Found {len(return_files)} in {self.directory_paths[pathid]}")
		return return_files
	
	# Loads files and returns them with the path included, e.g. returning "articuno/galarian"
	def load_indexed_files(self, pathid, fileid):
		base = Path(self.directory_paths[pathid])
		return_files = {}
		
		for file in base.rglob(fileid):
			if not file.is_file():
				continue
			
			# as_posix is to make all the \ into /
			rkey = file.relative_to(base).with_suffix("").as_posix()

			if "/" not in rkey:
				return_files[file.stem] = file
			else:
				return_files[rkey] = file
		
		return return_files


	# Simple thing to read JSON file data
	def extract_json_data(self, file_path):
		try:
			with open(file_path, 'r', encoding='utf-8') as file:
				data = json.load(file)
			
			return data
		except Exception as e:
			tqdm.tqdm.write(f"	Error processing {file_path}: {e}")
			return

	def extract_pokemon_data(self, file_path, is_fake):
		step = "loading from .json"
		# Extract and return data from a species file
		try:
			with open(file_path, 'r', encoding='utf-8') as file:
				data = json.load(file)
			
			step = "retrieving internal name from file name"
			# Get filename
			internal_name = os.path.splitext(os.path.basename(file_path))[0]
			data['internal_name'] = internal_name
			
			step = "applying additions"
			additions = self.additions_dict.get(internal_name)
			if additions:
				data = self.merge_dictionaries(data, additions)
			
			step = "applying fossil data"
			fossils = self.fossil_dict.get(internal_name)
			if fossils:
				data['fossils'] = fossils
			
			step = "processing base pokemon data"
			pokemon_data = [self.process_pokemon_data(data, {}, is_fake)]
			
			step = "retrieving forms"
			# Get forms
			forms = self.safe_get(data, 'forms', [])
			
			if forms:
				for form in forms:
					pokemon_data.append(self.process_pokemon_data(form, data, is_fake))
			
			
			step = "returning data"
			return (internal_name, pokemon_data)
			
		except Exception as e:
			tqdm.tqdm.write(f"	  Unexpected error in {file_path}: {e}")
			tqdm.tqdm.write(f"	  Exception occurred while {step}")
			return (None, None)

	# A not-so-simple thing to convert JavaScript into JSON.
	# There are probably better alternatives but I like regex so suck em.
	def extract_move_data(self, file_path, runfunc):
		# Turn a js/ts dictionary into a py dictionary
		# First tries to turn it into json, which can then be read
		# I didnt feel like pip installing any actual libraries
		step = "reading .js file"
		try:
			with open(file_path, 'r', encoding='utf-8') as file:
				content = file.read()
			
			# runfunc check here as moves.ts is too large to do this check on
			if runfunc:
				step = "removing functions from the .js file"
				# hopefully gets rid of "method() {..{...}..}" stuff, cos i dont think json or python likes that
				function_pattern = "[\n]*[^\n]+[)|=][ ][{](?:[^{}]|(?R))+[}][,]*"
				content = regex.sub(function_pattern, '', content)
			
			step = "putting dictionary keys in quotes"
			
			# regex, puts quotes around anything that has a : at the end of it
			def add_quotes(match):
				return f'"{match.group(0)}"'
			content = regex.sub(r'\w+(?=\:)', add_quotes, content)
			
			step = "turning single quotes into double quotes"
			
			# double quotes
			content = content.replace("'", '"')
			
			step = "removing trailing commas"
			
			# trailing commas
			content = regex.sub(r',\s*}', '}', content)
			content = regex.sub(r',\s*]', ']', content)
			
			step = "taking it out of parenthesis if its in them"
			
			# literally the only move with this issue is one i made
			content = regex.sub(r'(^[(]|[)]$)', '', content)
			
			step = "converting flags from a dictionary to a list"
			
			# Makes it easier to split up multiple moves in one file
			def flags_to_list(match):
				prefix = match.group(1)	 # "flags": {
				content = match.group(2)	# all the inner content
				suffix = match.group(3)	 # }
				
				items = content.split(',')
				keys = []
				for item in items:
					# Finds the key and separates it from the colon contents
					key_match = regex.search(r'"([^"]+)"\s*:', item)
					if key_match:
						keys.append(f'"{key_match.group(1)}"')
				
				# Put it all in the list format we want
				list_contents = ', '.join(keys)
				return f'"flags": [{list_contents}]'
			
			content = regex.sub(r'("flags":\s*\{)\s*([^}]+)\s*(\})', flags_to_list, content)
			
			step = "removing (singular) semi-colon"
			
			content = regex.sub("};$", '}', content)
			
			step = "loading the .js/ts file as a json file"
			
			try:
				data = json.loads(content)
				return data
			except json.JSONDecodeError as e:
				tqdm.tqdm.write(content)
				tqdm.tqdm.write(f"	  File {os.path.basename(file_path)} failed to read as JSON")
				tqdm.tqdm.write(f"	  Error: {e}")
				tqdm.tqdm.write(f"	  Line: {e.lineno}, Column: {e.colno}")
				return None
		except FileNotFoundError:
			tqdm.tqdm.write(f"	  File not found: {file_path}")
			return None
		except Exception as e:
			tqdm.tqdm.write(f"	  Unexpected error reading {file_path}: {e}")
			tqdm.tqdm.write(f"	  Exception occurred while {step}")
			return None
		

	# ----------------------------------------------------------------------------------------
	# -                                   Data processing                                    -
	# ----------------------------------------------------------------------------------------
	
	def write_to_json(self, file_path, data):
		with open(file_path, 'w') as outfile:
			json.dump(data, outfile, indent=4)
	
	def process_lang_data(self, full_language):
		# Takes a flat dictionary of all lang values, and makes it nested
		nested = {}
		
		for key, value in full_language.items():
			parts = key.split('.')
			current = nested
			
			for i, part in enumerate(parts[:-1]):
				if part in current and not isinstance(current[part], dict):
					old_value = current[part]
					current[part] = {'name': old_value}
				
				if part not in current:
					current[part] = {}
				
				current = current[part]
			
			final_part = parts[-1]
			
			if final_part in current and isinstance(current[final_part], dict):
				print(f"Warning: {key} is trying to set a value where a dict already exists")
				current[final_part]['name'] = value
			else:
				current[final_part] = value
		
		return nested
	
	def process_move_data(self, movedata, is_fake):
		nudata = {}
		
		if not movedata:
			return {}
		
		# Number
		nudata['num'] = self.safe_get(movedata, 'num', 99999)
		
		id = movedata.get('id', '')
		
		# Name, Description, Type, Category
		lang_data = self.lang_dict.get('cobblemon',{}).get('move',{}).get(id,{})
		lang_name = lang_data.get('name','')
		lang_desc = lang_data.get('desc','')
		if lang_name:
			nudata['name'] = lang_name
		else:
			nudata['name'] = self.safe_get(movedata, 'name', '-')
		nudata['desc'] = lang_desc
		nudata['type'] = self.safe_get(movedata, 'type', '-')
		nudata['category'] = self.safe_get(movedata, 'category', '-')
		
		# PP, Power
		nudata['pp'] = self.safe_get(movedata, 'pp', '-')
		nudata['basePower'] = self.safe_get(movedata, 'basePower', 0)
		
		# Accuracy
		accuracy = self.safe_get(movedata, 'accuracy', 999)
		if accuracy == True:
			accuracy = 999
		nudata['accuracy'] = accuracy
		
		# Target Type
		target = movedata.get('target','normal')
		if target:
			target = self.camelcase_to_space(target).title()
		else:
			target = "-"
		nudata['target'] = target
		
		# Priority & Flags
		flags= self.safe_get(movedata, 'flags', [])
		priority = movedata['priority']
		
		if priority:
			if priority != 0:
				if priority > 0:
					priority = f"+{priority}"
				priority = f"Priority{priority}"
				flags.append(priority)
		
		if flags and isinstance(flags, list):
			flags = ', '.join([g.title() for g in flags])
		else:
			flags = "-"
		
		nudata['flags'] = flags
		
		if is_fake:
			nudata['is_fake'] = True
		
		if id:
			self.move_dict[id] = nudata
		
		return nudata
	
	def process_tags(self, tags):
		return_list = []
		for tag in tags:
			split = tag.split(':')[1]
			if tag[0] == "#":
				if self.tag_dict.get(split, False):
					for tag in self.tag_dict[split]:
						return_list.append(tag.split(':')[1].replace('_',' ').title())
				else:
					return_list.append(split.replace('_',' ').title())
			else:
				return_list.append(split.replace('_',' ').title())
		return return_list

	def process_spawnpool_data(self, data):
		# Extract and return a list of spawns
		returndata = {}
		for spawn in data['spawns']:
			if not spawn.get('pokemon', False):
				return "cannot process herd files"
			# A large ugly stack of replacements for alt_internal_id stuff. This should probably get organized and put into its own function
			pokemon = spawn.get('pokemon', '').lower().replace(' ', '-').replace('_','-')
			pokemon = pokemon.replace('gmax', 'gigantamax').replace('region-bias=alola','alolan-bias').replace('region-bias=galar','galarian-bias').replace('-cream','-cream-love').replace('-swirl','-swirl-love')
			removals = ["flower=","dance_style=","-amethyst","-emerald","-echo","-quartz","-allay","spell-forme=","'",'\u2019']
			for removal in removals:
				pokemon = pokemon.replace(removal,"")
			
			if 'minior' in pokemon:
				if '=meteor' in pokemon:
					pokemon = 'minior-meteor'
				else:
					pokemon = 'minior'
			elif pokemon == 'oricorio':
				pokemon = 'oricorio-baile'
			elif pokemon == "wizledger":
				pokemon = 'wizledger-fire'
			elif 'papersol' in pokemon:
				pokemon = 'papersol'
			elif 'umbrelligant' in pokemon:
				pokemon = 'umbrelligant'
			
			if spawn.get('spawnablePositionType',''):
				spawn['context'] = spawn.get('spawnablePositionType','')
				spawn.pop('spawnablePositionType')
			new_condition = {}
			for key, value in spawn.get('condition',{}).items():
				new_key = self.camelcase_to_space(key).title()
				if isinstance(value, list):
					value = self.process_tags(value)
				new_condition[new_key] = value
			spawn['condition'] = new_condition
			if spawn.get('anticondition', False):
				new_anticondition = {}
				for key, value in spawn.get('anticondition',{}).items():
					new_key = self.camelcase_to_space(key).title()
					if isinstance(value, list):
						value = self.process_tags(value)
					new_anticondition[new_key] = value
				spawn['anticondition'] = new_anticondition
			try:
				returndata[pokemon].append(spawn)
			except:
				try:
					returndata[pokemon] = [spawn]
				except:
					return f"failed to set spawndata for {pokemon}"
		
		return returndata
	
	def calculate_catch_chance(self, catch_rate):
		a = catch_rate / 3
		b = 65536 / ((255 / a) ** 0.1875)
		return ((b / 65536) ** 4) * 100
	
	# Takes a raw move learnset and splits it into tables based on learn method
	def categorize_moves(self, moves_list, debug_name):
		level_moves = []
		tm_moves = []
		egg_moves = []
		
		if not isinstance(moves_list, list):
			return level_moves, tm_moves, egg_moves
		
		for move in moves_list:
			if isinstance(move, str):
				move_string = move
			else:
				continue
			
			# Safety check, all moves are supposed to have "prefix:move_name"
			if ':' in move_string:
				prefix, move_name = move_string.split(':', 1)
				
				# Another safety check I don't quite recall why I added
				move_name = move_name.replace('-', '')

				# This is literally just to give an error, Pokemon data only contains move ID's
				move_data = self.safe_get(self.move_dict, move_name, {})
				if not move_data:
					tqdm.tqdm.write(f"	{debug_name} has move '{move_string}' in learnset, which has no data.")
				
				# Sorting moves by their learn criteria
				# Level moves get additional data for what level they are learned at
				if prefix.isdigit():
					level_moves.append({
						'move': move_name,
						'level': int(prefix)
					})
				
				# Egg moves don't have any special criteria so they just get put in a list
				elif prefix.lower() == 'egg':
					egg_moves.append(move_name)
					
				# Same with TM Moves as with Egg Moves
				elif prefix.lower() == 'tm':
					tm_moves.append(move_name)
				
				# Tutor moves  -  not for display, but may be in the future
				elif prefix.lower() == 'tutor':
					pass
				
				# Legacy moves  -  not for display, but may be in the future
				elif prefix.lower() == 'legacy':
					pass
				

		return level_moves, tm_moves, egg_moves
	
	def process_pokemon_data(self, data, base_data, is_fake):
		
		step = "defining helper functions"
		try:
			def get_wbase(key, default):
				nval = data.get(key, None)
				if nval != None:
					return nval
				bval = base_data.get(key, None)
				if bval != None:
					return bval
				return default
				
			step = "creating a display name"
			# Get display name
			display_name = base_data.get('name', None)
			if display_name:
				nuname = data.get('name', None).replace('_', '-')
				if nuname:
					display_name = f"{display_name} {nuname}"
			else:
				display_name = data.get('name', 'ERROR')
			display_name = display_name.title()
			if display_name == "Oricorio":
				display_name = "Oricorio Baile"
			elif display_name == "Wizledger":
				display_name = "Wizledger Fire-Spell"
			
			step = "creating alternative internal name"
			# For some image API's, that prefer iron-moth to ironmoth
			alt_internal_name = display_name.lower().replace(' ', '-').replace('gmax', 'gigantamax').replace('alola', 'alolan').replace('hisui', 'hisuian').replace('galar', 'galarian').replace("'", "").replace('\u2019', '').replace('_','-').replace('.','').replace('?','qm').replace('!','em').replace('-cream','-cream-love').replace('-swirl','-swirl-love').replace('-spell','')
			replacements = {
				'flabebe':'flabebe-red',
				'floette':'floette-red',
				'florges':'florges-red',
				'oricorio':'oricorio-baile',
				'wizledger':'wizledger-fire',
				'indeedee-f':'indeedee-female',
				'meowstic-f':'meowstic-female',
				'meowstic-f-festival':'meowstic-female-festival',
				'basculegion-f':'basculegion-female',
				'oinkologne-f':'oinkologne-female'
			}
			for target, replacement in replacements.items():
				if alt_internal_name == target:
					alt_internal_name = replacement
					break
			
			step = "retrieving primary and secondary types"
			# Types
			primary_type = get_wbase('primaryType', '')
			secondary_type = get_wbase('secondaryType', '')
			
			step = "getting base stats"
			# Base stats
			base_stats = get_wbase('baseStats', {})
			
			step = "creating stat projections from base stats"
			# Stat projections
			stat_projections = {}
			stat_projections['50'] = {}
			stat_projections['100'] = {}
			
			def add_stat_projection(name, value):
				if name == 'hp':
					stat_projections['50']['hp'] = self.calculate_hp_low_high(value, 50)
					stat_projections['100']['hp'] = self.calculate_hp_low_high(value, 100)
				else:
					stat_projections['50'][name] = self.calculate_stat_low_high(value, 50)
					stat_projections['100'][name] = self.calculate_stat_low_high(value, 100)
			
			# Stats
			hp = base_stats.get('hp', 0)
			add_stat_projection('hp', hp)
			
			attack = base_stats.get('attack', 0)
			add_stat_projection('attack', attack)
			
			defence = base_stats.get('defence', 0)
			add_stat_projection('defence', defence)
			
			special_attack = base_stats.get('special_attack', 0)
			add_stat_projection('special_attack', special_attack)
			
			special_defence = base_stats.get('special_defence', 0)
			add_stat_projection('special_defence', special_defence)
			
			speed = base_stats.get('speed', 0)
			add_stat_projection('speed', speed)
			
			total = hp + attack + defence + special_attack + special_defence + speed
			
			step = "getting and organizing abilities"
			# Abilities
			abilities = get_wbase('abilities', {})
			ability_primary = None
			ability_secondary = None
			ability_hidden = None
			
			if isinstance(abilities, list):
				for ability in abilities:
					if ':' in ability:
						prefix, ability_name = ability.split(':', 1)
						if prefix.lower() == 'h':
							ability_hidden = ability_name
						else:
							if not ability_primary:
								ability_primary = ability_name
							else:
								ability_secondary = ability_name
					else:
						if not ability_primary:
							ability_primary = ability
						else:
							ability_secondary = ability
				
			step = "calculating catch rate"
			# Catch rate
			catch_rate_raw = get_wbase('catchRate', 0)
			catch_rate_str = ''
			if catch_rate_raw:
				catch_rate_str = f"{catch_rate_raw} ({self.calculate_catch_chance(catch_rate_raw):.1f}%)"
			
			step = "getting internal name"
			# Internal name for following uses
			internal_name = get_wbase('internal_name', '')
			
			step = "getting and categorizing moves"
			# All moves
			moves = get_wbase('moves', [])
			level_moves, tm_moves, egg_moves = self.categorize_moves(moves, internal_name)
			
			step = "getting evolutions"
			# Evolution info				
			evolutions = get_wbase('evolutions', [])
			processed_evolutions = []
			for evolution in evolutions:
				evo_result = evolution.get('result', '')
				if evo_result:
					evo_result_link = evo_result.split()[0]
					if evo_result_link and evo_result != evo_result_link:
						evolution['result_link'] = evo_result_link
						parts = evo_result.split(' ')
						nparts = []
						for part in parts:
							part = part.split('=')
							part.reverse()
							nparts.append(part[0])
						evolution['result'] = ' '.join(nparts)
				
				learnable_moves = []
				for move in evolution.get('learnableMoves', []):
					# newname = self.safe_get(self.safe_get(self.move_dict, move, {}), 'name', move)
					learnable_moves.append(move)
				if len(learnable_moves) > 0:
					evolution['learnableMoves'] = learnable_moves
				
				required_context = evolution.get('requiredContext', '')
				if required_context:
					if ':' in required_context:
						required_context = required_context.split(':')[1].replace('_', ' ').title()
					else:
						evolution['requiredContext_pokemon'] = required_context
						required_context = required_context.title()
					evolution['requiredContext'] = required_context
				
				requirements = evolution.get('requirements', [])
				if requirements:
					new_requirements = []
					for requirement in requirements:
						variant = requirement.get('variant', '')
						if variant:
							if variant == "held_item":
								itemCondition = requirement.get('itemCondition', '')
								if itemCondition:
									requirement.pop('itemCondition')
									requirement['item'] = itemCondition.split(':')[1].replace('_',' ').title()
							elif variant == "biome":
								biomeCondition = requirement.get('biomeCondition', False)
								if biomeCondition:
									requirement.pop('biomeCondition')
									requirement['condition'] = self.process_tags([biomeCondition])[0]
								antiCondition = requirement.get('biomeAnticondition', False)
								if antiCondition:
									requirement.pop('biomeAnticondition')
									requirement['anticondition'] = self.process_tags([antiCondition])[0]
						new_requirements.append(requirement)
					evolution['requirements'] = new_requirements
				
				processed_evolutions.append(evolution)
			
				
			step = "getting and formatting drops"
			# Drops
			drops = get_wbase('drops', {})
			drops_list = []
			drop_amount = 0
			
			if isinstance(drops, dict):
				amount = drops.get('amount', '1')
				
				try:
					amount = int(amount)
				except (ValueError, TypeError):
					amount = 1
				
				drop_amount = amount
				entries = drops.get('entries', [])
				
				if isinstance(entries, list):
					# If there are multiple entries, show them grouped
					for entry in entries:
						if isinstance(entry, dict):
							item = entry.get('item', '')
							if item:
								item_name = item.split(':')[-1].replace('_', ' ').title()
								
								quantity_range = entry.get('quantityRange', '1')
								percentage = entry.get('percentage', 100)
								
								drops_list.append(f"{quantity_range} {item_name} ({percentage}%)")
				
			step = "getting egg groups"
			# Egg groups
			egg_groups = get_wbase('eggGroups', [])
			egg_primary = ""
			egg_secondary = ""
			if isinstance(egg_groups, list):
				for egg_group in egg_groups:
					if egg_primary:
						egg_secondary = egg_group
					else:
						egg_primary = egg_group
			else:
				egg_primary = egg_groups
			
			step = "getting pre-evolution"
			# Pre-evolution
			pre_evolution = get_wbase('preEvolution', '')
			if isinstance(pre_evolution, str):
				pre_evolution = [pre_evolution]
			pre_evolution_processed = {}
			for prevo in pre_evolution:
				if prevo:
					pre_evolution_processed[prevo.split(' ')[0]] = prevo.title()
			
			step = "checking labels"
			legendary = 0
			labels = get_wbase('labels', [])
			for label in labels:
				if label == "legendary" and legendary < 5:
					legendary = 5
					break
				elif label == "mythical" and legendary < 4:
					legendary = 4
				elif label == "powerhouse" and legendary < 3:
					legendary = 3
				elif label == "ultra_beast" and legendary < 2:
					legendary = 2
			
			step = "getting fossil data"
			fossils = get_wbase('fossils', '')
			
			step = "getting pokemon category"
			# Pokemon Category
			pokemon_category = self.safe_get(self.pokemon_categories, internal_name, "")
			
			step = "getting spawn conditions"
			# Spawn conditions
			spawn_conditions = self.safe_get(self.spawn_data, alt_internal_name, [])
			
			step = "setting gmax weight"
			# Gmax Weight
			weight = get_wbase('weight', 0)
			if "gmax" in display_name.lower():
				weight = 1337
			if "eternamax" in display_name.lower():
				weight = 1337
			
			step = "assembling data"
			return_data =  {
				'name': display_name,
				'category': pokemon_category,
				'internal_name': internal_name,
				'alt_internal_name': alt_internal_name,
				'national_pokedex_number': get_wbase('nationalPokedexNumber', 9999),
				'types': {"primary":primary_type.title(),"secondary":secondary_type.title()},
				'stats':{'hp':hp,'attack':attack,'defence':defence,'special_attack':special_attack,'special_defence':special_defence,'speed':speed,'total':total,'projections':stat_projections},
				'abilities': {"primary":ability_primary,"secondary":ability_secondary,"hidden":ability_hidden},
				'height': get_wbase('height', 0),
				'weight': weight,
				'catch_rate': {'string':catch_rate_str,'number':catch_rate_raw},
				'leveling_rate': get_wbase('experienceGroup', 'error').replace('_', ' ').title(),
				'male_ratio': get_wbase('maleRatio', 0.5),
				'egg_groups': [egg_primary, egg_secondary],
				'pre_evolution': pre_evolution_processed,
				'evolutions': processed_evolutions,
				'legendary': legendary,
				'drop_amount': drop_amount,
				'drops': drops_list,
				'level_moves': level_moves,
				'tm_moves': tm_moves,
				'egg_moves': egg_moves,
				'spawns': spawn_conditions
			}
			if fossils:
				return_data['fossils'] = fossils
				if legendary < 2:
					return_data['legendary'] = 1
			if is_fake or get_wbase('is_fake', False):
				return_data['is_fake'] = True
			if get_wbase('is_fake_form', False):
				return_data['is_fake_form'] = True
			
			step = "returning data"
			return return_data
		except Exception as e:
			tqdm.tqdm.write(f"	  Unexpected error: {e}")
			tqdm.tqdm.write(f"	  Exception occurred while {step}")
			return None
	
	# Returns tagged and processed data to be inserted into additions_dict later
	def process_additions_data(self, data):
		step = "retrieving base pokemon name"
		try:
			target = data.get('target', '')
			if target:
				if ":" in target:
					target = target.split(':')[1]
			
			step = "removing target value"
			data.pop('target')

			step = "tagging forms as fake"
			forms = data.get('forms', [])
			for i, form in enumerate(forms):
				data['forms'][i]['is_fake_form'] = True
			
			step= "returning additions"
			return(target, data)
			
		except Exception as e:
			tqdm.tqdm.write(f"	  Unexpected error: {e}")
			tqdm.tqdm.write(f"	  Exception occurred while {step}")
			return (None, None)
	
	# Despite my confusing naming schema, this is actually just a helper.
	# It runs a function over every file in a list of files.
	def process_all_files(self, all_files, func):
		if all_files:
			successes = 0
			if isinstance(all_files, list):
				iterator = enumerate(all_files)
			elif isinstance(all_files, dict):
				iterator = all_files.items()
			else:
				tqdm.tqdm.write(f"	Failed to process files: iterator is a {type(all_files)}")
				return False
			with tqdm.tqdm(total=len(all_files)) as pbar:
				for i, file_path in iterator:
					pbar.set_description(f"Processing: {os.path.basename(file_path).ljust(15)}")
					data = self.extract_json_data(file_path)
					if data:
						try:
							status = func(data, i)
							if status and not isinstance(status, str):
								successes += 1
							else:
								tqdm.tqdm.write(f"	Failed to process {os.path.basename(file_path)}: {status}")
						except Exception as e:
							tqdm.tqdm.write(f"	Unexpected error in {os.path.basename(file_path)}: {e}")
					else:
						tqdm.tqdm.write(f"	Failed to read json data of {os.path.basename(file_path)}")
					pbar.update(1)
			
			tqdm.tqdm.write(f"Successfully loaded {successes}/{len(all_files)} files\n")
		else:
			tqdm.tqdm.write("No files found!")
	
	# ----------------------------------------------------------------------------------------
	# -                            The part that does everything                             -
	# ----------------------------------------------------------------------------------------

	def process_all(self):
		# Main processing function
		
		lang_files = self.load_shallow_files('lang', '*.json')
		def lang_func(data, _):
			self.lang_dict = self.lang_dict | data
			return True
		self.process_all_files(lang_files, lang_func)
		self.lang_dict = self.process_lang_data(self.lang_dict)
		#self.write_to_json('en_us.json', self.lang_dict)
		
		# Load some unclear tags to make things like spawn conditions readable
		tag_files = self.load_indexed_files('tags/biome', '*.json')
		def tag_func(data, index):
			data = data.get("values", [])
			nudata = []
			for value in data:
				if isinstance(value, dict):
					nudata.append(value.get("id"))
				else:
					nudata.append(value)
			self.tag_dict[index] = nudata
			return True
		self.process_all_files(tag_files, tag_func)
		#self.write_to_json('tag_debug.json', self.tag_dict)

		abilities = self.lang_dict.get('cobblemon',{}).get('ability',{})
		for id, info in abilities.items():
			self.ability_dict[id] = info
		#self.write_to_json('abilities.json', self.ability_dict)
		
		# Try to load moves first, so species can reference their data when building the learnset info
		move_files = self.load_shallow_files('moves', '*.js')
		if move_files:
			pbar = tqdm.tqdm(move_files)
			for i, file_path in enumerate(pbar, 1):
				pbar.set_description(f"Processing: {os.path.basename(file_path).ljust(15)}")
				move = self.extract_move_data(file_path, True)
				move['id'] = os.path.splitext(os.path.basename(file_path))[0]
				move = self.process_move_data(move, True)
				if move:
					self.move_data.append(move)
				else:
					tqdm.tqdm.write(f"	  Failed to retrieve move from: {os.path.basename(file_path)}")
					
			tqdm.tqdm.write(f"Successfully loaded {len(self.move_data)}/{len(move_files)} moves\n")
		else:
			tqdm.tqdm.write("No move files found!")
			tqdm.tqdm.write(f"Make sure your move files are in: {os.path.abspath(self.directory_paths['moves'])}\n")
		
		self.move_data.sort(key=lambda x: x['num'])
		#self.write_to_json('cmoves.json', self.move_data)
			
		# Loading all default moves, for display and name reference
		full_move_files = self.load_shallow_files('moves', '*.ts')
		if full_move_files:
			for i, file_path in enumerate(full_move_files, 1):
				full_moves = self.extract_move_data(file_path, False)
				if full_moves:
					startlen = len(self.move_data)
					pbar = tqdm.tqdm(total=len(full_moves))
					for moveid, move in full_moves.items():
						pbar.set_description(f"Processing: {moveid.ljust(15)}")
						move['id'] = moveid
						move = self.process_move_data(move, False)
						if move:
							self.move_data.append(move)
							pbar.update(1)
						else:
							tqdm.tqdm.write(f"	  Failed to retrieve move '{moveid}' from: {os.path.basename(file_path)}")
					pbar.close()
					tqdm.tqdm.write(f"Successfully loaded {len(self.move_data)-startlen}/{len(full_moves)} moves\n")
				else:
					tqdm.tqdm.write(f"	  Failed to retrieve any moves from: {os.path.basename(file_path)}")
		else:
			tqdm.tqdm.write("No .ts move files found!")
			tqdm.tqdm.write(f"Make sure your .ts move files are in: {os.path.abspath(self.directory_paths['moves'])}\n")
		
		self.move_data.sort(key=lambda x: x['num'])
		#self.write_to_json('moves.json', self.move_data)
		#self.write_to_json('moves_dict.json', self.move_dict)
		
		fossil_files = self.load_shallow_files('fossil', '*.json')
		def fossil_func(data, _):
			result = data.get('result')
			if result:
				items = data.get('fossils')
				if items:
					return_data = []
					for fossil in items:
						return_data.append(fossil.split(':')[1].replace('_',' ').title())
					self.fossil_dict[result] = return_data
					return True
			return "error"
		self.process_all_files(fossil_files, fossil_func)
		#self.write_to_json('fossils.json', self.fossil_dict)
		
		
		
		spawnpool_files = self.load_deep_files('spawns', '*.json')
		def spawn_func(data, _):
			pools = self.process_spawnpool_data(data)
			if isinstance(pools, str):
				return pools
			for pokemon, data in pools.items():
				if self.spawn_data.get(pokemon):
					existing_spawns = self.spawn_data[pokemon]
					for spawn in data:
						existing_spawns.append(spawn)
					self.spawn_data[pokemon] = existing_spawns
				else:
					self.spawn_data[pokemon] = data
			return True
		self.process_all_files(spawnpool_files, spawn_func)
		#self.write_to_json('debug.json', self.spawn_data)
		
		
		addition_files = self.load_deep_files('additions', '*.json')
		def additions_func(data, _):
			iname, pokemon = self.process_additions_data(data)
			if pokemon:
				olddata = self.additions_dict.get(iname)
				if olddata:
					pokemon = self.merge_dictionaries(olddata, pokemon)
				self.additions_dict[iname] = pokemon
				return True
			return False
		self.process_all_files(addition_files, additions_func)
		
		# Try to load all the fakemon species
		fakemon_files = self.load_shallow_files('species', '*.json')
		if fakemon_files:
			# Extract species data from all files
			pbar = tqdm.tqdm(fakemon_files)
			for i, file_path in enumerate(pbar, 1):
				pbar.set_description(f"Processing: {os.path.basename(file_path).ljust(15)}")
				iname, pokemon = self.extract_pokemon_data(file_path, True)
				if pokemon:
					self.pokemon_dict[iname] = pokemon
				else:
					tqdm.tqdm.write(f"	Failed to retrieve Pokemon from: {os.path.basename(file_path)}")
				
			tqdm.tqdm.write(f"Successfully loaded {len(self.pokemon_dict)}/{len(fakemon_files)} Pokemon\n")
		else:
			tqdm.tqdm.write("No pokemon files found!")
			tqdm.tqdm.write(f"Make sure your species files are in: {os.path.abspath(self.directory_paths['species'])}\n")
			
		
		
		# Try to load all the base Cobblemon species
		species_files = self.load_deep_files('species', '*.json')
		if species_files:
			startlen = len(self.pokemon_dict)
			# Extract species data from all files
			pbar = tqdm.tqdm(species_files)
			for i, file_path in enumerate(pbar, 1):
				pbar.set_description(f"Processing: {os.path.basename(file_path).ljust(15)}")
				iname, pokemon = self.extract_pokemon_data(file_path, False)
				if pokemon:
					self.pokemon_dict[iname] = pokemon
				else:
					tqdm.tqdm.write(f"	Failed to retrieve base Pokemon from: {os.path.basename(file_path)}")
				
			tqdm.tqdm.write(f"Successfully loaded {len(self.pokemon_dict)-startlen}/{len(species_files)} Base Pokemon\n")
		else:
			tqdm.tqdm.write("No base pokemon files found!")
			tqdm.tqdm.write(f"Make sure your species files are nested within: {os.path.abspath(self.directory_paths['species'])}\n")
		
		#self.write_to_json('species.json', self.pokemon_dict)
		
		
		return True

	def db_compile(self):
		TEXT="TEXT"
		INTEGER="INTEGER"
		REAL="REAL"

		species_datapoints = {
			"name":TEXT,
			"internal_name":TEXT,
			"alt_internal_name":TEXT,
			"national_pokedex_number":INTEGER,
			"legendary":INTEGER,
			"is_fake":INTEGER,
			"is_fake_form":INTEGER,
			"extra":TEXT
		}

		move_datapoints = {
			"num":INTEGER,
			"name":TEXT,
			"type":TEXT,
			"category":TEXT,
			"is_fake":INTEGER,
			"extra":TEXT
		}

		ability_datapoints = {
			"name":TEXT,
			"desc":TEXT
		}

		conn = sqlite3.connect("wiki.db")
		cur = conn.cursor()

		def make_string(dict):
			string = ""
			for key, value in dict.items():
				string += ", " + key + " " + value
			return string

		cur.execute("DROP TABLE IF EXISTS species")
		cur.execute("DROP TABLE IF EXISTS moves")
		cur.execute("DROP TABLE IF EXISTS abilities")
		cur.execute(f"CREATE TABLE IF NOT EXISTS species ( id INTEGER PRIMARY KEY AUTOINCREMENT{make_string(species_datapoints)} )")
		cur.execute(f"CREATE TABLE IF NOT EXISTS moves ( id TEXT{make_string(move_datapoints)} )")
		cur.execute(f"CREATE TABLE IF NOT EXISTS abilities ( id TEXT{make_string(ability_datapoints)} )")

		def add_category(data, datapoints, target, autoid=False):
			tqdm.tqdm.write(f"Adding '{target}' table to database.")
			pbar = tqdm.tqdm(total=len(data))
			for category, items in data.items():
				pbar.set_description(f"Processing: {category.ljust(10)}")
				def process_info(item):
					tuple = ()
					if autoid:
						tuple = (category,)
					for key, type in datapoints.items():
						if key == "extra":
							continue
						value = item.get(key, "0")
						if type == "INTEGER":
							value = int(value)
						elif type == "REAL":
							value = float(value)
						elif type == "TEXT":
							if value == None:
								value = ""
							else:
								value = str(value)
						
						tuple += (value,)
						if item.get(key) != None:
							item.pop(key)
					if datapoints.get('extra'):
						tuple += (json.dumps({k: v for k, v in item.items()}),)
					
					keys = ', '.join(datapoints.keys())

					if autoid:
						cur.execute(f"INSERT INTO {target} (id, {keys}) VALUES (?, {", ".join("?"*len(datapoints))})", tuple)
					else:
						cur.execute(f"INSERT INTO {target} ({keys}) VALUES ({", ".join("?"*len(datapoints))})", tuple)
				
				if isinstance(items,list):
					for item in items:
						process_info(item)
				else:
					process_info(items)
				pbar.update(1)
			
			pbar.close()
			tqdm.tqdm.write(f"Successfully added '{target}' table to database!\n")
			conn.commit()
		
		add_category(self.pokemon_dict, species_datapoints, "species")
		add_category(self.move_dict, move_datapoints, "moves", True)
		add_category(self.ability_dict, ability_datapoints, "abilities", True)

		conn.close()

		tqdm.tqdm.write("\nDatabase built successfully!")

		return True


if __name__ == "__main__":
	tqdm.tqdm.write("╔═════════════════════╗")
	tqdm.tqdm.write("║COBBLEMON DB COMPILER║")
	tqdm.tqdm.write("╚═════════════════════╝")
	tqdm.tqdm.write("")
	
	species_directory = "./species"
	moves_directory = "./moves"
	spawnpool_directory = "./spawn_pool_world"
	lang_directory = "./lang"
	fossil_directory = "./fossils"
	additions_directory = "./species_additions"
	tag_biome_directory = "./tags/biome"
	
	tqdm.tqdm.write(f"Looking for species in: {os.path.abspath(species_directory)}")
	tqdm.tqdm.write(f"Looking for moves in: {os.path.abspath(moves_directory)}")
	tqdm.tqdm.write(f"Looking for spawns in: {os.path.abspath(spawnpool_directory)}")
	tqdm.tqdm.write(f"Looking for lang in: {os.path.abspath(lang_directory)}")
	tqdm.tqdm.write(f"Looking for additions in: {os.path.abspath(lang_directory)}")
	tqdm.tqdm.write("\n")
	
	converter = DataScraper({'species':species_directory, 'moves':moves_directory, 'spawns':spawnpool_directory, 'lang':lang_directory, 'additions':additions_directory, 'fossil':fossil_directory, 'tags/biome':tag_biome_directory})
	
	if converter.process_all():
		if converter.db_compile():
			tqdm.tqdm.write("\nDone! Press Enter to exit...")
		else:
			tqdm.tqdm.write("\nDatabase compilation has returned false")
			tqdm.tqdm.write("If there are no errors, check code for incorrect return values")
	else:
		tqdm.tqdm.write("\nProcessing has returned false")
		tqdm.tqdm.write("If there are no errors, check code for incorrect return values")
	
	input()