import axios from 'axios'

export default function request({ url, method = 'GET', data }) {
    return new Promise((resolve, reject) => {
        let options = { url, method }
        if (method.toUpperCase() === 'GET') {
            options.params = data
        } else {
            options.data = data
        }
        return axios(options)
            .then(res => {
                if (res.status === 200) {
                    res.data.status === 'success' ? resolve(res.data.data) : reject(res.data)
                } else {
                    reject(res.data)
                }
            })
            .catch(error => [
                console.log(error.res)
            ])
    })
}