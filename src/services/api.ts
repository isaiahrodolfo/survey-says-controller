import { supabase } from "../utils/supabase";

/**
 * TODO:
 *
 * - [ ] remove extra (empty rows) from the board creator UI
 *
 * - [ ] FETCH survey answers
 * - [ ] WRITE board when game is started
 *   - [ ] remember to add checks: write to supabase, then move forward with navigation if successful, otherwise show error message
 * - [ ] add loading states for fetch/write
 * - [ ] add error handling for fetch/write
 * - [ ] add types for survey answers and board
 *
 * - [ ] POST shown/hidden state of each answer for each question
 *
 *
 * - [ ] start the board screen code. it must listen for changes and update the board in real time as the controller changes the shown/hidden state of each answer
 * - [ ] use supabase's real-time functionality to listen for changes to the board and update the UI accordingly
 *
 * - [ ] nice-to-have: add functionality to controller to end the game, which will then navigate to a final screen that shows the results of the game (maybe just show the final board with all answers revealed?)
 */
