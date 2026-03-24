# Core Logic Rules

## D. Execution Order & Conflict Resolution (Strict Priority)
The game logic must process the night actions in a specific sequence to resolve the one-time retaliation correctly:

### Priority 1: Witch's Poison
- If the Witch poisons the Ghost Werewolf, the Witch is marked for "Retaliation Death."
- Set has_retaliated = true immediately.
- The Ghost Werewolf survives the poison.

### Priority 2: Seer's Investigation
- Check First: Only trigger retaliation if has_retaliated is still false.
- If the Seer investigates the Ghost Werewolf AND the Witch has NOT already triggered the retaliation this night:
    - The Seer is marked for "Retaliation Death."
    - Set has_retaliated = true.
- If has_retaliated is already true (due to the Witch): The Seer successfully investigates the Ghost Werewolf (gets the "Werewolf" result) but does not die.

## E. Implementation Detail for night_phase
Please ensure the resolve_night_actions() function iterates through roles in this specific order: Witch -> Seer.

Use a temporary death_list to store the results of the retaliation so they can be announced simultaneously at dawn.
