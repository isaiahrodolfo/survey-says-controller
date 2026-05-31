import { supabase } from "../utils/supabase";

export type Answer = {
  id: number;
  user_id: number;
  question_id: number;
  answer_text: string;
};

export type Question = {
  id: number;
  question: string;
};

export type BoardStateRow = {
  question_id: number;
  count: number;
  category: string;
  is_hidden?: boolean; // TODO: when we fetch from the backend, this can be true or false on startup
};

export const fetchAnswers = async (): Promise<Answer[]> => {
  const { data, error } = await supabase
    .from("answers")
    .select("id, user_id, question_id, answer_text");

  if (error) {
    console.error("Error fetching answers:", error);
    throw error;
  }

  return data as Answer[];
};

export const fetchQuestions = async (): Promise<Question[]> => {
  const { data, error } = await supabase
    .from("questions")
    .select("id, question");

  if (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }

  return data as Question[];
};

export const writeBoardState = async (
  boardState: BoardStateRow[],
): Promise<void> => {
  // delete existing board state. TODO: update board state instead of deleting and re-inserting
  const { error: deleteError } = await supabase
    .from("board_state")
    .delete()
    .neq("id", 0); // delete all rows (but supabase doesn't allow .delete() without a filter, so we add a filter that is always true)
  if (deleteError) {
    throw deleteError;
  }

  const { error } = await supabase.from("board_state").insert(
    boardState.map((row) => ({
      question_id: row.question_id,
      category: row.category,
      count: row.count,
      is_hidden: row.is_hidden ?? true, // default to true if is_hidden is undefined
    })),
  );

  if (error) {
    console.error("Error writing board state:", error);
    throw error;
  }

  return;
};

export const updateBoardStateQuestionCategories = async (
  question_id: number,
  categories: BoardStateRow[],
): Promise<void> => {
  // delete existing categories for this question
  const { error: deleteError } = await supabase
    .from("board_state")
    .delete()
    .eq("question_id", question_id);

  if (deleteError) {
    console.error(
      "Error deleting existing board state categories:",
      deleteError,
    );
    throw deleteError;
  }

  // insert new categories for this question with count = 0 and is_hidden = true
  const { error } = await supabase.from("board_state").insert(
    categories.map((category) => ({
      question_id,
      category,
      count: category.count,
      is_hidden: true,
    })),
  );

  if (error) {
    console.error("Error inserting new board state categories:", error);
    throw error;
  }
};

export const toggleShownHidden = async (
  question_id: number,
  category: string,
  is_hidden: boolean,
): Promise<void> => {
  // Update the is_hidden value for the specific question and category
  const { error } = await supabase
    .from("board_state")
    .update({ is_hidden: !is_hidden })
    .eq("question_id", question_id)
    .eq("category", category);

  if (error) {
    console.error("Error toggling shown/hidden state:", error);
    throw error;
  }
};

export const writeCurrentQuestion = async (
  question_id: number,
): Promise<void> => {
  // Update the current_question_id in the game_state table
  const { error } = await supabase
    .from("current_question")
    .update({ current_question_id: question_id })
    .eq("id", 1); // assuming there's only one row in game_state with id = 1

  if (error) {
    console.error("Error setting current question:", error);
    throw error;
  }
};

/**
 * TODO:
 *
 * - [x] Remove extra (empty) rows from the board controller UI
 *
 * - [x] FETCH survey answers
 * - [x] WRITE board when game is started
 * - [ ] add loading states for fetch/write
 * - [ ] add error handling for fetch/write
 * - [ ] add types for survey answers and board
 *
 * - [x] POST shown/hidden state of each answer for each question
 *
 *
 * - [ ] start the board screen code. it must listen for changes and update the board in real time as the controller changes the shown/hidden state of each answer
 * - [ ] use supabase's real-time functionality to listen for changes to the board and update the UI accordingly
 *
 * - [ ] nice-to-have: add functionality to controller to end the game, which will then navigate to a final screen that shows the results of the game (maybe just show the final board with all answers revealed?)
 */
