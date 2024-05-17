import Pokemon from "../models/pokemon";
import POKEMONS from "../models/mock-pokemon";
import AuthenticationService from "./authentication-service";

export default class PokemonService {

    static pokemons: Pokemon[] = POKEMONS;

    static isDev = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development');

    static HOST = 'http://localhost:3000/api/pokemons'

    static config = {headers: {Authorization: `Bearer ${AuthenticationService.token}`}} as RequestInit


    static getPokemons(): Promise<Pokemon[]> {
        console.log('HOST', this.HOST)
        if (this.isDev) {
            return fetch(this.HOST, this.config)
                .then(response => response.json())
                .then(result => result.data)
                .catch(error => this.handleError(error));
        }

        return new Promise(resolve => {
            resolve(this.pokemons);
        });
    }

    static getPokemon(id: number): Promise<Pokemon | null> {
        if (this.isDev) {
            return fetch(this.HOST + '/' + id, this.config)
                .then(response => response.json())
                .then(result => result.data)
                .then(data => this.isEmpty(data) ? null : data)
                .catch(error => this.handleError(error));
        }

        return new Promise(resolve => {
            resolve(this.pokemons.find(pokemon => id === pokemon.id));
        });
    }

    static updatePokemon(pokemon: Pokemon): Promise<Pokemon> {
        if (this.isDev) {
            return fetch(`${this.HOST}/${pokemon.id}`, {
                method: 'PUT',
                body: JSON.stringify(pokemon),
                headers: {'Content-Type': 'application/json', ...this.config.headers}
            })
                .then(response => response.json())
                .then(result => result.data)
                .catch(error => this.handleError(error));
        }

        return new Promise(resolve => {
            const {id} = pokemon;
            const index = this.pokemons.findIndex(pokemon => pokemon.id === id);
            this.pokemons[index] = pokemon;
            resolve(pokemon);
        });
    }

    static deletePokemon(pokemon: Pokemon): Promise<{}> {
        if (this.isDev) {
            return fetch(`http://localhost:3000/api/pokemons/${pokemon.id}`, {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'}
            })
                .then(response => response.json())
                .then(result => result.data)
                .catch(error => this.handleError(error));
        }

        return new Promise(resolve => {
            const {id} = pokemon;
            this.pokemons = this.pokemons.filter(pokemon => pokemon.id !== id);
            resolve({});
        });
    }

    static addPokemon(pokemon: Pokemon): Promise<Pokemon> {
        delete pokemon.created;

        if (this.isDev) {
            return fetch(`http://localhost:3000/api/pokemons`, {
                method: 'POST',
                body: JSON.stringify(pokemon),
                headers: {'Content-Type': 'application/json'}
            })
                .then(response => response.json())
                .then(result => result.data)
                .catch(error => this.handleError(error));
        }

        return new Promise(resolve => {
            this.pokemons.push(pokemon);
            resolve(pokemon);
        });
    }

    static searchPokemon(term: string): Promise<Pokemon[]> {
        if (this.isDev) {
            return fetch(`http://localhost:3000/api/pokemons?q=${term}`)
                .then(response => response.json())
                .then(result => result.data)
                .catch(error => this.handleError(error));
        }

        return new Promise(resolve => {
            const results = this.pokemons.filter(pokemon => pokemon.name.includes(term));
            resolve(results);
        });

    }

    static isEmpty(data: Object): boolean {
        return Object.keys(data).length === 0;
    }

    static handleError(error: Error): void {
        console.error(error);
    }
}