class MarvelService {
	_apiBase = 'https://gateway.marvel.com:443/v1/public/';
	_apiKey = 'apikey=a3f3e1bb52e9dfbb1dcd77116fe51560';

	getResourse = async (url) => {
		let res = await fetch(url);
		if (!res.ok) {
			throw new Error(`Could not fetch ${url}, status ${res.status}`);
		}

		return await res.json();
	};

	getAllCharacters = async (offset=210) => {
		// const offset = Math.floor(Math.random() * 1500) + 1;
		const res = await this.getResourse(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`);
		return res.data.results.map(this._transformCharacter);
	};
	getCharacter = async (id) => {
		const res = await this.getResourse(`${this._apiBase}characters/${id}?${this._apiKey}`);

		return this._transformCharacter(res.data.results[0]);
	};

	_transformCharacter = (char) => {
		return {
			id: char.id,
			name: char.name,
			// description: char.description.length > 100 ? `${char.description.slice(0, 100)} ...` : char.description,
			description: char.description
				? `${char.description.slice(0, 210)}...`
				: 'There is no description for this character',
			thumbnail: `${char.thumbnail.path}.${char.thumbnail.extension}`,
			homepage: char.urls[0].url,
			wiki: char.urls[1].url,
			comics: char.comics.items.slice(0,10)
		};
	};
}

export default MarvelService;
