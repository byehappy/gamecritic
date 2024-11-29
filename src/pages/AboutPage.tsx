import styled from "styled-components";
import { SkeletonFactory } from "../utils/skeleton/skeleton-factory";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { Button, Input } from "antd";
import IconEditor from "../components/iconEditor/IconEditor";
import AvatarEditor from "react-avatar-editor";
import { useNavigate, useParams } from "react-router-dom";
import { getUserInfo, uploadUserInfo } from "../axios";
import { setMessage } from "../redux/slice/messageSlice";
const UserInfoWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 25vh;
  padding: 2vh 5vw;
  gap: 5%;
`;
const IconUser = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 100%;
  background-color: #9494944e;
`;
const UserFormWrapper = styled.div`
  padding: 3%;
  gap: 5%;
  display: flex;
  flex-direction: column;
  width: 75%;
`;
export const AboutePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { userId } = useParams();
  const editor = useRef<AvatarEditor>(null);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const [whoAbout, setWhoAbout] = useState<null | string>(null);
  const [userInfo, setUserInfo] = useState<{
    name: string | undefined;
    description: string | undefined;
    init_image: string | undefined;
  }>({ name: undefined, description: undefined, init_image: undefined });
  const handleSave = async () => {
    const canvas = editor.current?.getImageScaledToCanvas();
    if (!canvas) return;
    const img = canvas.toDataURL();

    if (!currentUser) return;
    try {
      const result = await uploadUserInfo(currentUser.id, {
        name: userInfo.name,
        about_text: userInfo.description,
        img_icon: img,
      });
      dispatch(setMessage(result.data));
    } catch (error) {
      dispatch(setMessage(error));
    }
  };
  const getInfo = useCallback(async (userId: string) => {
    const resInfo = await getUserInfo(userId).then((res) => res.data);
    setWhoAbout(userId);
    setUserInfo(resInfo);
  }, []);
  useEffect(() => {
    if (userId) {
      getInfo(userId);
      setLoading(false);
      return;
    }
    if (!currentUser) {
      dispatch(setMessage({ error: "Вы не авторизованны" }));
      navigate("/");
      return;
    }
    getInfo(currentUser.id);

    setLoading(false);
  }, [currentUser, dispatch, getInfo, navigate, userId]);
  return (
    <>
      <UserInfoWrapper>
        {loading && SkeletonFactory(1, "Icon")}
        {currentUser &&
          !loading &&
          userInfo.init_image &&
          whoAbout === currentUser.id && (
            <IconEditor editor={editor} init_image={userInfo.init_image} />
          )}
        {currentUser &&
          !loading &&
          userInfo.init_image &&
          whoAbout === userId && <IconUser style={{width:"11vw"}} src={userInfo.init_image} />}
        {currentUser ? (
          <UserFormWrapper>
            <div>
              <div>
                Никнейм:
                {userId ? (
                  userInfo.name
                ) : (
                  <Input
                    value={userInfo.name ?? ""}
                    onChange={(e) =>
                      setUserInfo((prev) => ({ ...prev, name: e.target.value }))
                    }
                    required
                  />
                )}
              </div>
              <div>
                Описание:
                {userId ? (
                  userInfo.description
                ) : (
                  <Input
                    value={userInfo.description ?? ""}
                    onChange={(e) =>
                      setUserInfo((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    required
                  />
                )}
              </div>
            </div>
            {!userId && <Button onClick={handleSave}>Сохранить</Button>}
          </UserFormWrapper>
        ) : null}
      </UserInfoWrapper>
      <div
        style={{
          display: "flex",
          gap: "1vw",
          flexWrap: "wrap",
          marginTop: "2vw",
        }}
      >
        {loading && SkeletonFactory(10, "AbouteCard")}
      </div>
    </>
  );
};
