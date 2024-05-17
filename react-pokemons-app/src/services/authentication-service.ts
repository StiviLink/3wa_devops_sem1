import Pokemon from "../models/pokemon";

export default class AuthenticationService {

    static token: string | null = localStorage.getItem('token');

    static login(username: string, password: string): Promise<any> {

        return fetch(`http://localhost:3000/api/login`, {
            method: 'POST',
            body: JSON.stringify({username, password}),
            headers: {'Content-Type': 'application/json'}
        })
            .then(async response => {
                const {token} = await response.json()
                console.log('token', token)
                this.token = token
                return !!token
            })
            .catch(error => console.error(error))
    }
}