import axios from 'axios';
import { ref } from'vue'

export async function downloadDepartments(){
    try {
        const response = await axios.get('/api/user/department');
        departmentOptions.value = response.data.data.map(item => ({
            value: item.id,  // или item.id, в зависимости от структуры ответа
            label: item.title  // или item.name
        }));
    } catch (error) {
        console.error('Ошибка загрузки отделов:', error);
        return []; // Возвращаем пустой массив в случае ошибки
    }
}

export async function getMe(){
    try{
        const response = await axios.get('/api/user/me')
        return response
    } catch (error) {
        console.error('Ошибка загрузки информации о вас:', error);
        return []; // Возвращаем пустой массив в случае ошибки
    }
}

export async function getEvents(){
    try{
        const response = await axios.get('/api/user/event')
        return response
    } catch (error) {
        console.error('Ошибка создания евента:', error);
        return []; // Возвращаем пустой массив в случае ошибки
    }
}
