import React from 'react';
import PropTypes from 'prop-types';
import classes from './StudentInfo.module.css';

import { Avatar, Divider } from '@material-ui/core';
import { UseLanguage } from '../../../../lang/LanguagesContext';

const StudentInfo = ({ student }) => {
    const { t } = UseLanguage();

    return (
        <div className={classes.Container}>
            <div className={classes.Photo}>
                <Avatar className={classes.Avatar} src={student.photo} />
            </div>
            <div className={classes.Info}>
                <div className={classes.Data}>
                    <div className={classes.Title}>
                        <h3>{t('students.details.fullName')}</h3>
                    </div>
                    <div className={classes.Content}>
                        <h4>
                            {student.student_surname}&nbsp;
                            {student.student_name}&nbsp;
                            {student.student_fname}
                        </h4>
                    </div>
                </div>
                <Divider className={classes.Divider} />

                <div className={classes.Data}>
                    <div className={classes.Title}>
                        <h3>{t('students.details.faculty')}</h3>
                    </div>
                    <div className={classes.Content}>
                        <h4>{student.faculty_name}</h4>
                    </div>
                </div>
                <Divider className={classes.Divider} />

                <div className={classes.Data}>
                    <div className={classes.Title}>
                        <h3>{t('students.details.speaciality')}</h3>
                    </div>
                    <div className={classes.Content}>
                        <h4>
                            {student.speciality_code} {student.speciality_name}
                        </h4>
                    </div>
                </div>
                <Divider className={classes.Divider} />

                <div className={classes.Data}>
                    <div className={classes.Title}>
                        <h3>{t('students.details.group')}</h3>
                    </div>
                    <div className={classes.Content}>
                        <h4>{student.group_name}</h4>
                    </div>
                </div>
                <Divider className={classes.Divider} />

                <div className={classes.Data}>
                    <div className={classes.Title}>
                        <h3>{t('students.details.code')}</h3>
                    </div>
                    <div className={classes.Content}>
                        <h4>{student.gradebook_id}</h4>
                    </div>
                </div>
                <Divider className={classes.Divider} />

                <div className={classes.Data}>
                    <div className={classes.Title}>
                        <h3>{t('students.details.email')}</h3>
                    </div>
                    <div className={classes.Content}>
                        <h4>{student.email}</h4>
                    </div>
                </div>
                <Divider className={classes.Divider} />

                <div className={classes.Data}>
                    <div className={classes.Title}>
                        <h3>{t('students.details.login')}</h3>
                    </div>
                    <div className={classes.Content}>
                        <h4>{student.username}</h4>
                    </div>
                </div>
                <Divider className={classes.Divider} />
            </div>
        </div>
    );
};

export default StudentInfo;

StudentInfo.propTypes = {
    student: PropTypes.object,
};
