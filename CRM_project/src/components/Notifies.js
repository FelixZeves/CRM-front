import router from '@/router';
import { Notify, SessionStorage, copyToClipboard } from 'quasar'

export async function checkPass(){
    const user = SessionStorage.getItem('user')

    if (user.default_pass){
        Notify.create({
            type: 'negative',
            position: 'top',
            color: 'brand-velvet',
            message: 'Пожалуйста, смените стандартный пароль',
            actions: [
                {label: 'Сменить', color: 'white', handler: () => {router.push('/PasswordChanging')}},
        ]})
    }

}

export function successNotify(msg='Успех!'){
    Notify.create({
        type: 'positive',
        position: 'top',
        message: msg})
}

export function passClipboardNotify(newPass){
    Notify.create({
        type: 'positive',
        position: 'top',
        color: 'brand-velvet',
        progress: true,
        message: newPass,
        caption: 'Это ваш временный пароль',
        actions: [
            {label: 'Копировать', color: 'white', handler: copyToClipboard(newPass)}
    ]})
}

export function confirmNotify(func){
    Notify.create({
        type: 'ongoing',
        position: 'top',
        color: 'red-5',
        message: 'Вы уверены?',
        actions: [
            {label: 'Подтвердить', color: 'white', handler: func},
            {label: 'Отменить', color: 'white'}
        ]
    })
}

export function errorNotify(msg){
    Notify.create({
        type: 'negative',
        position: 'top',
        message: `Ошибка: ${msg}`,
    });
}
