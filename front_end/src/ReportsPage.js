import Nav from './Nav.js';

import { useParams } from 'react-router-dom';

const ReportsPage = () => {

  const { username } = useParams();

  return (
    <>

      <Nav username={username} />

      <div className="ReportsPage">
        
      </div>

    </>
  )
}

export default ReportsPage;
