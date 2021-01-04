import React from "react";

import DashboardCard from "./DashboardCard";
import './Dashboard.css'

  const cards = [
    {
      image:
        "https://www.sandhills.edu/wp-content/uploads/2019/03/classroom.jpg",
      title: "Факультети",
      path: "/admin/faculties",
      component: "Faculty",
    },
    {
      image:
        "https://www.sandhills.edu/wp-content/uploads/2019/03/classroom.jpg",
      title: "Групи",
      path: "/admin/groups",
      component: "Groups",
    },
    {
      image:
        "https://www.sandhills.edu/wp-content/uploads/2019/03/classroom.jpg",
      title: "Спеціальності",
      path: "/admin/speciality",
      component: "Speciality",
    },
    {
      image:
        "https://www.sandhills.edu/wp-content/uploads/2019/03/classroom.jpg",
      title: "Предмети",
      path: "admin/subjects",
      component: "Subject",
    },
    {
      image:
        "https://www.sandhills.edu/wp-content/uploads/2019/03/classroom.jpg",
      title: "Студенти",
      path: "admin/groups",
      component: "Groups",
    },
    {
      image:
        "https://www.sandhills.edu/wp-content/uploads/2019/03/classroom.jpg",
      title: "Адміни",
      path: "admin/admins",
      component: "Admins",
    },
    {
      image:
        "https://www.sandhills.edu/wp-content/uploads/2019/03/classroom.jpg",
      title: "Результати",
      path: "admin/results",
      component: "Results",
    },
    {
      image:
        "https://www.sandhills.edu/wp-content/uploads/2019/03/classroom.jpg",
      title: "Протокол",
      path: "admin/protocol",
      component: "Protocol",
    },
  ];

function DashboardGrid() {

  return (
    <div className="cards-grid">
      {cards.map((item, index) => (
        <DashboardCard card={item} key={index} />
      ))}
    </div>
  );
}

export default DashboardGrid;
