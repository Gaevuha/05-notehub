import axios from "axios";
import type { Note, NewNoteData } from "../types/note";

axios.defaults.baseURL = 'https://notehub-public.goit.study/api';


const ACCESS_TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;
if (!ACCESS_TOKEN) {
  throw new Error('NoteHub API key is missing');
}


interface fetchNotesProps {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  query: string = "",
  page: number = 1,
  perPage: number = 12
): Promise<fetchNotesProps> => {
  const params: Record<string, string | number> = { page, perPage };

  if (query.trim() !== "") {
    params.search = query;
  }

  const result = await axios.get<fetchNotesProps>("/notes", {
    params,
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
  });

  return result.data;
};

export const createNote = async (noteData: NewNoteData) => {
    const result = await axios.post<Note>("/notes", noteData, {
        headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
    });
    return result.data;
};


export const deleteNote = async (noteId: string | number) => {
    const result = await axios.delete(`/notes/${noteId}`, {
        headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
    });
    return result.data;
};



