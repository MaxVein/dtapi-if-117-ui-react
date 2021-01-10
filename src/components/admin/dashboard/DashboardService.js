import axios from 'axios';
import { environment } from '../../../environments/environment';
// import SnackbarHandler from "../../../common/snackbar";

export async function getNumberOfRecords() {
    const FacultiesNumber = await axios
        .get(`${environment.BASEURL}Faculty/countRecords`)
        .then((res) => res.data);
    const GroupsNumber = await axios
        .get(`${environment.BASEURL}Group/countRecords`)
        .then((res) => res.data);
    const SpecialitiesNumber = await axios
        .get(`${environment.BASEURL}Speciality/countRecords`)
        .then((res) => res.data);
    const SubjectsNumber = await axios
        .get(`${environment.BASEURL}Subject/countRecords`)
        .then((res) => res.data);
    const StudentsNumber = await axios
        .get(`${environment.BASEURL}Student/countRecords`)
        .then((res) => res.data);
    const AdminsNumber = await axios
        .get(`${environment.BASEURL}AdminUser/countRecords`)
        .then((res) => res.data);

    const result = axios
        .all([
            FacultiesNumber,
            GroupsNumber,
            SpecialitiesNumber,
            SubjectsNumber,
            StudentsNumber,
            AdminsNumber,
        ])
        .then((res) => res);
    // .catch((err) => SnackbarHandler(err.message, "error"));
    return result;
}

export function createCardData(title, path, component, hasCount, count = 0, image) {
    return {
        title,
        path,
        component,
        hasCount,
        count,
        image,
    };
}

export function createCardsArray(counts) {
    if (counts !== undefined) {
        const cards = [
            createCardData(
                'Факультети',
                '/admin/faculties',
                'Faculty',
                true,
                counts[0].numberOfRecords,
                'https://www.sandhills.edu/wp-content/uploads/2019/03/classroom.jpg',
            ),
            createCardData(
                'Групи',
                '/admin/group',
                'Groups',
                true,
                counts[1].numberOfRecords,
                'https://skilledwork.org/wp-content/uploads/2014/01/1105572-medium.jpg',
            ),
            createCardData(
                'Спеціальності',
                '/admin/speciality',
                'Speciality',
                true,
                counts[2].numberOfRecords,
                'https://prontomarketing.pi.bypronto.com/3/wp-content/uploads/sites/3/2020/08/Managed-Services-Provider-e1596510425847.jpg',
            ),
            createCardData(
                'Предмети',
                '/admin/subjects',
                'Subject',
                true,
                counts[3].numberOfRecords,
                'https://nhsportpress.com/wp-content/uploads/2019/11/district-tech.jpeg',
            ),
            createCardData(
                'Студенти',
                '/admin/group',
                'Groups',
                true,
                counts[4].numberOfRecords,
                'https://www.orangeschool.com.ua/wp-content/uploads/2019/07/%D0%BA%D1%83%D1%80%D1%81%D1%8B-%D0%B0%D0%BD%D0%B3%D0%BB%D0%B8%D0%B9%D1%81%D0%BA%D0%BE%D0%B3%D0%BE.jpg',
            ),
            createCardData(
                'Адміни',
                '/admin/admins',
                'Admins',
                true,
                counts[5].numberOfRecords,
                'https://teleme.io/assets/feature_updates/tg_group_admins.jpg',
            ),
            createCardData(
                'Результати',
                'results',
                'Results',
                false,
                null,
                'https://images.hrtechnologist.com/images/uploads/content_images/how_hr_business_partners_can_translate_data_into_business_result_5e66237452fdc.png',
            ),
            createCardData(
                'Протокол',
                'protocol',
                'Protocol',
                false,
                null,
                'https://cdn.searchenginejournal.com/wp-content/uploads/2019/12/how-your-digital-agency-can-leverage-client-reports-to-prove-value-5debc3863d361-760x400.png',
            ),
        ];
        return cards;
    }

    return null;
}
