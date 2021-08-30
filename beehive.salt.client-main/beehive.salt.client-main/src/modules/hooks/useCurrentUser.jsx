import useAxios from "axios-hooks";

export default () => {
  const userFromStorage = localStorage.getItem('user');
  const user = userFromStorage ? JSON.parse(userFromStorage) : null;

  const [{ data, loading, error }] = useAxios({
    url: `${process.env.REACT_APP_API_URL}/users/current-user`,
    headers: {
      Authorization: user ? `Bearer ${user.authToken}` : null,
      method: 'get',
    },
  });

  return { data, loading, error };
};
