import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';
import './charList.scss';

const CharList = (props) => {
	const [charList, setCharList] = useState([]);
	const [loading, setLoading] = useState(true);
	const [newItemLoading, setNewItemLoading] = useState(true);
	const [error, setError] = useState(false);
	const [offset, setOffset] = useState(210);
	const [charEnded, setCharEnded] = useState(false);

	const marvelService = new MarvelService();

	useEffect(() => {
		window.addEventListener('scroll', onScroll);
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	useEffect(() => {
		if (newItemLoading && !charEnded) {
			onRequest();
		}
		// eslint-disable-next-line
	}, [newItemLoading]);

	const onScroll = () => {
		if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight) {
			setNewItemLoading(true);
		}
	};

	const onRequest = () => {
		onCharListLoading();
		marvelService
			.getAllCharacters(offset)
			.then(onCharListLoaded)
			.catch(onError)
			.finally(() => setNewItemLoading(false));
	};

	const onCharListLoading = () => {
		setNewItemLoading(true);
	};

	const onCharListLoaded = (newCharList) => {
		setCharList((charList) => [...charList, ...newCharList]);
		setLoading(false);
		setError(false);
		setOffset((offset) => offset + 9);
		setCharEnded(newCharList.length < 9 ? true : false);
	};

	const onError = () => {
		setError(true);
		setLoading(false);
	};

	const itemRefs = useRef([]);

	const focusOnItem = (id, itemId) => {
		itemRefs.current.forEach((item) => item.classList.remove('char__item_selected'));
		itemRefs.current[id].classList.add('char__item_selected');
		itemRefs.current[id].focus();
	};

	function renderItems(arr) {
		const items = arr.map((item, i) => {
			let imgStyle = { objectFit: 'cover' };
			if (item.thumbnail.includes('image_not_available')) {
				imgStyle = { objectFit: 'unset' };
			}

			return (
				<li
					className="char__item"
					key={item.id}
					tabIndex={0}
					ref={(el) => (itemRefs.current[i] = el)}
					onClick={() => {
						props.onCharSelected(item.id);
						focusOnItem(i);
					}}
					onFocus={() => {
						props.onCharSelected(item.id);
						focusOnItem(i);
					}}>
					<img src={item.thumbnail} alt={item.name} style={imgStyle} />
					<div className="char__name">{item.name}</div>
				</li>
			);
		});

		return <ul className="char__grid">{items}</ul>;
	}

	const items = renderItems(charList);
	const errorMessage = error ? <ErrorMessage /> : null;
	const spinner = loading ? <Spinner /> : null;
	const content = !(loading || error) ? items : null;

	return (
		<div className="char__list">
			{errorMessage}
			{content}
			{spinner}
			<button className="button button__main button__long" disabled={newItemLoading} onClick={() => setNewItemLoading(true)}>
				<div className="inner">{newItemLoading ? 'Loading...' : 'More'}</div>
			</button>
		</div>
	);
};

CharList.propTypes = {
	onCharSelected: PropTypes.func.isRequired,
};

export default CharList;
