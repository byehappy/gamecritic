import styled from "styled-components";
import { SkeletonFactory } from "../utils/skeleton/skeleton-factory";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { Button, Input } from "antd";
import IconEditor from "../components/iconEditor/IconEditor";
import AvatarEditor from "react-avatar-editor";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAllAboutGames, getUserInfo, uploadUserInfo } from "../axios";
import { setMessage } from "../redux/slice/messageSlice";
import { IAboutGame } from "../interfaces/aboutGames";
import { AboutCard } from "../components/aboutCard/AboutCard";
import { setImageIcon } from "../redux/slice/authSlice";
import { EditOutlined } from "@ant-design/icons";
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
  const [aboutGames, setAboutGames] = useState<IAboutGame[] | null>(null);
  const [edit, setEdit] = useState(false);
  const [userInfo, setUserInfo] = useState<{
    name: string | undefined;
    description: string | undefined;
    init_image: string | undefined;
  }>({ name: undefined, description: undefined, init_image: undefined });
  const [editInfo, setEditInfo] = useState<{
    name: string | undefined;
    description: string | undefined;
  }>({ name: undefined, description: undefined });
  const handleSave = async () => {
    const canvas = editor.current?.getImageScaledToCanvas();
    if (!canvas) return;
    const img = canvas.toDataURL();

    if (!currentUser) return;
    try {
      const result = await uploadUserInfo(currentUser.id, {
        name: editInfo.name,
        about_text: editInfo.description,
        img_icon: img,
      });
      dispatch(setMessage({ success: result.data.success }));
      setUserInfo((prev) => ({
        ...prev,
        name: editInfo.name,
        description: editInfo.description,
      }));
      dispatch(setImageIcon(result.data.image_icon));
    } catch (error) {
      dispatch(setMessage(error));
    }
  };
  const getInfo = useCallback(
    async (userId: string) => {
      try {
        const resInfo = await getUserInfo(userId).then((res) => res.data);
        const resGames = await getAllAboutGames(userId);
        setAboutGames(resGames);
        setUserInfo(resInfo);
      } catch (error) {
        dispatch(setMessage(error));
      }
    },
    [dispatch]
  );
  useEffect(() => {
    if (userId) {
      if (userId === currentUser?.id) {
        navigate("/about-me");
        return;
      }
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

  useEffect(()=>{
    if (!edit){
      setEditInfo({name:userInfo.name,description:userInfo.description})
    }
  },[edit, userInfo.description, userInfo.name])
  return (
    <>
      <UserInfoWrapper>
        {loading && (
          <div style={{ width: "12vw", height: "20vh" }}>
            {SkeletonFactory(1, "Icon")}
          </div>
        )}
        {edit && !loading && userInfo.init_image && (
          <IconEditor editor={editor} init_image={userInfo.init_image} />
        )}
        {!loading && userInfo.init_image && !edit && (
          <IconUser
            style={{ width: "12vw", objectFit: "cover" }}
            src={userInfo.init_image}
          />
        )}
        {userInfo ? (
          <UserFormWrapper>
            <div>
              <div>
                Никнейм:
                {!edit ? (
                  userInfo.name
                ) : (
                  <Input
                    value={editInfo.name ?? ""}
                    onChange={(e) =>
                      setEditInfo((prev) => ({ ...prev, name: e.target.value }))
                    }
                    required
                  />
                )}
              </div>
              <div>
                Описание:
                {!edit ? (
                  userInfo.description
                ) : (
                  <Input
                    value={editInfo.description ?? ""}
                    onChange={(e) =>
                      setEditInfo((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    required
                  />
                )}
              </div>
            </div>
            {edit && <Button onClick={handleSave}>Сохранить</Button>}
          </UserFormWrapper>
        ) : null}
        {userId ? (
          <Link
            to={`/user/${userId}`}
            style={{ textWrap: "nowrap", height: "min-content" }}
          >
            Перейти в профиль
          </Link>
        ) : (
          <Button
            size="large"
            type="primary"
            danger={edit}
            variant="solid"
            onClick={() => setEdit((prev) => !prev)}
          >
            <EditOutlined />
          </Button>
        )}
      </UserInfoWrapper>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
          marginTop: "2vw",
        }}
      >
        {aboutGames?.map((e) => (
          <AboutCard card={e} key={e.id} change={!userId} />
        ))}

        {loading && SkeletonFactory(10, "AbouteCard")}
      </div>
    </>
  );
};
