import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import Description from "./components/description";
import Course from "./components/course";
import Operation from "./components/operation";
import Admin from "./components/Admin";

const HomeContent = (props) => {
  const [tab, setTab] = useState('');
  const location = useLocation();

  const { user } = props;

  useEffect(() => {
    const search = new URLSearchParams(location.search);
    setTab(search.get('tab') || 'description')
  }, [location.search]);


  return <div>
    {
      tab === 'description' && <Description user={user}/>
    }
    {
      tab === 'course' && <Course/>
    }
    {
      tab === 'operation' && user.status === 1 &&  <Operation/>
    }
    {
      tab === 'admin' && user.status === 1&& <Admin/>
    }
  </div>
}

export default HomeContent