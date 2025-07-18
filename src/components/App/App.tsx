import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import css from './App.module.css';
import { fetchNotes } from '../../services/noteService';
import SearchBox from '../SearchBox/SearchBox';
import { useDebounce } from "use-debounce"
import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';


export default function App() {
	const [inputValue, setInputValue] = useState("");
  const [page, setPage] = useState(1);
	const [searchQuery] = useDebounce(inputValue, 300);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
  setPage(1);
  }, [searchQuery]);

  const { data, isLoading } = useQuery({
  queryKey: ["notes", searchQuery, page],
	queryFn: () => fetchNotes(searchQuery, page),
	placeholderData: keepPreviousData,
  });
	
	

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={inputValue} onSearch={setInputValue} />
        
		{data && data.totalPages > 1 && (
		<Pagination page={page} totalPages={data.totalPages} onChange={setPage} />
		)}

        <button className={css.button} onClick={openModal}>Create note +</button>

      </header>

  	{!isLoading && data?.notes && data.notes.length > 0 && (
	<NoteList notes={data.notes} />
		  )}
		    {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onCloseModal={closeModal} />
        </Modal>
      )}
    </div>
  );
}
