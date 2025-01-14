import styled, { useTheme } from "styled-components";
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
import { device } from "../styles/size";
const UserInfoWrapper = styled.div`
  display: flex;
  width: 100%;
  min-height: 200px;
  padding: 2vh 5vw;
  gap: 5%;
  align-items: center;
  @media (max-width: 425px) {
    flex-direction: column;
    align-items: center;
  }
  @media ${device.tablet} {
    flex-direction: row;
  }
`;
const UserIconWrapper = styled.div`
  min-width: 200px;
  height: 200px;
`;
const IconUser = styled.img`
  border-radius: 100%;
  width: 200px;
  height: 200px;
  object-fit: cover;
  background-color: lightgray;
`;
const UserFormWrapper = styled.div`
  gap: 5%;
  display: flex;
  font-size: ${({ theme }) => theme.fontSizes.adaptivText};
  flex-direction: column;
  width: 100%;
  @media ${device.tablet} {
    width: 75%;
  }
`;
export const AboutePage = () => {
  const theme = useTheme();
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
      setUserInfo({
        name: editInfo.name,
        description: editInfo.description,
        init_image: result.data.image_icon,
      });
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
      } finally {
        setLoading(false);
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
      return;
    }
    if (!currentUser) {
      dispatch(setMessage({ error: "Вы не авторизованны" }));
      navigate("/");
      return;
    }
    getInfo(currentUser.id);
  }, [currentUser, dispatch, getInfo, navigate, userId]);

  useEffect(() => {
    if (!edit) {
      setEditInfo({ name: userInfo.name, description: userInfo.description });
    }
  }, [edit, userInfo.description, userInfo.name]);
  return (
    <>
      <UserInfoWrapper>
        {loading && (
          <UserIconWrapper>{SkeletonFactory(1, "Icon")} </UserIconWrapper>
        )}
        {!loading && userInfo.init_image && !edit && (
          <IconUser src={userInfo.init_image} />
        )}
        {edit && !loading && userInfo.init_image && (
          <IconEditor editor={editor} init_image={userInfo.init_image} />
        )}
        {userInfo ? (
          <UserFormWrapper>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1vh" }}
            >
              {!edit && (
                <div style={{ padding: "3%" }}>
                  <div>Никнейм:{userInfo.name}</div>
                  <div>Описание:{userInfo.description}</div>
                </div>
              )}
              {edit && (
                <div>
                  <div>
                    Никнейм:
                    <Input
                      value={editInfo.name ?? ""}
                      onChange={(e) =>
                        setEditInfo((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>
              )}
              {edit && (
                <div>
                  <div>
                    Описание:
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
                  </div>
                </div>
              )}
            </div>
            {edit && (
              <div style={{ display: "flex", marginTop: "2vh" }}>
                <Button style={{ width: "100%" }} onClick={handleSave}>
                  Сохранить
                </Button>
                <Button
                  style={{ width: "75%" }}
                  danger
                  onClick={() => setEdit(false)}
                >
                  Отмена
                </Button>
              </div>
            )}
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
          !edit && (
            <Button
              size="large"
              type="primary"
              variant="solid"
              style={{
                background: theme.colors.primary,
                width: "50px",
                alignSelf: "flex-start",
                margin:"auto"
              }}
              onClick={() => setEdit(true)}
            >
              <EditOutlined />
            </Button>
          )
        )}
      </UserInfoWrapper>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
          marginTop: "2vw",
          gap: "10px",
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
