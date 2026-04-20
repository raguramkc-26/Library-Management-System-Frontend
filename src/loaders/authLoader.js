import { getMe } from "../services/authServices";

const authLoader = async () => {
  try {
    const res = await getMe();
    return res.user;
  } catch {
    return null; 
  }
};

export default authLoader;