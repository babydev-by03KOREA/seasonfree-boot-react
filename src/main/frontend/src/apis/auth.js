import axios from "axios";

export const LoginApi = async (userId, password) => {
    axios.post('/user/login', {userId, password})
        .then(res => console.info(res.data))
        .catch(err => console.error(err))
}
