import { useUser } from './UserContext';

import { Backdrop, CircularProgress } from '@mui/material';

function Loading() {
  const { loading } = useUser();

  return (
    <Backdrop open={loading} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <CircularProgress color="primary" />
    </Backdrop>
  )
}

export default Loading;
