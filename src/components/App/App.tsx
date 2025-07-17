import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { useState } from 'react';
import css from './App.module.css';
import { fetchNotes, deleteNote } from '../../services/noteService';
import SearchBox from '../SearchBox/SearchBox';
import { useDebouncedCallback } from "use-debounce";
import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';


export default function App() {
	const [searchQuery, setSearchQuery] = useState("");
	const updateSearchQuery = useDebouncedCallback(setSearchQuery, 500);
	const queryClient = useQueryClient();
	const [page, setPage] = useState(1);


  const { data, isLoading } = useQuery({
    queryKey: ["notes", searchQuery, page],
	queryFn: () => fetchNotes(searchQuery, page),
	placeholderData: keepPreviousData,
  });

  const { mutate: deleteNoteById } = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handleDelete = (id: number | string) => {
    deleteNoteById(id);
  };
	
	const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchQuery} onSearch={updateSearchQuery} />
        
		{data && data.totalPages > 1 && (
		<Pagination page={page} totalPages={data.totalPages} onChange={setPage} />
		)}

        <button className={css.button} onClick={openModal}>Create note +</button>

      </header>

  	{!isLoading && data?.notes && data.notes.length > 0 && (
	<NoteList notes={data.notes} onDelete={handleDelete} />
		  )}
		    {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onCloseModal={closeModal} />
        </Modal>
      )}
    </div>
  );
}
