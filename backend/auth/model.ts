import { refreshTK, secret } from '../constants';
import jwt from 'jsonwebtoken';

type ywtAuth = {
    token: string;
    refreshToken: string;
};


function generateAccessToken(id: Number | string, username: string) {
    return jwt.sign({ id: id, username: username }, secret, { expiresIn: '30m' })
}

const authModel = {
    login(id: Number, username: string): ywtAuth {
        const token = generateAccessToken(id, username)
        const refreshToken = jwt.sign({ id: id, username: username }, refreshTK)
        return { token, refreshToken };
    },
    token(refreshToken: string) {
        try {
            let user_token = jwt.verify(refreshToken, refreshTK);
            if (user_token) {
                const accessToken = generateAccessToken((<any>user_token).id, (<any>user_token).username)
                return accessToken;
            }
        } catch (error) {
            console.error(error);
        }

    }
};

export default authModel;
