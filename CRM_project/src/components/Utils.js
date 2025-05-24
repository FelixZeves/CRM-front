import axios from 'axios';
import { ref } from'vue'

export const departmentOptions = ref([]);

async function downloadDepartments(){
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

// downloadDepartments()

