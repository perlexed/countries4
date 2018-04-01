
import axios from "axios/index";

export default class NetworkHelper {

    constructor(baseUrl = '') {
        this.baseUrl = baseUrl;
    }

    send(url, axiosConfig = {}) {
        return axios.post(this.baseUrl + url, Object.assign({
            _csrf: window.yii.getCsrfToken(),
        }, axiosConfig), {
            responseType: 'json',
        })
    }
}