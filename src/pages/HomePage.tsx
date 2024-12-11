import { Carousel } from "antd";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { TemplateCard } from "../components/templateCard/TemplateCard";
import { useCallback, useEffect, useState } from "react";
import { getAllTiers, getTopUsers } from "../axios";
import uuid4 from "uuid4";
import { SkeletonFactory } from "../utils/skeleton/skeleton-factory";
import { UserTemplateCard } from "../components/userTemplateCard/UserTemplateCard";
import {
  DeleteTier,
  getUsersTiers,
  Tier,
  UserTier,
} from "../axios/requests/gamecriticAPI/tierData.requests";
import { partArray } from "../utils/partedArray";
import { UserCard } from "../components/userCard/UserCard";
import { TopUsers } from "../axios/requests/gamecriticAPI/passGame.request";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setMessage } from "../redux/slice/messageSlice";
import { TimeoutRequest } from "../utils/cancelableReq";
import { useToaster } from "../utils/hooks/useToaster";

const CarouselWrapper = styled(Carousel)`
  margin: 2vh 0;
  padding: 0.3em;
  display: flex;
  button.slick-arrow {
    color: black;
  }
`;
const ContainerTemplateItems = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(8vw, 1fr));
  gap: 1vw;
  height: 100%;
  padding: 0 1vw;
`;
const ContainerUsersTemplateItems = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20%, 1fr));
  gap: 1vw;
  height: 100%;
  padding: 0 1vw;
`;
const ContainerTopUsersItems = styled.div`
  display: flex;
  gap: 1vw;
  height: 100%;
  padding: 0 1vw;
  overflow: overlay;
`;
const IntroText = styled.h1`
  display: flex;
  flex-direction: column;
  margin: 3vh 0;
  font-size: 1.8rem;
  p {
    margin: 1vh 0;
    font-weight: 300;
  }
`;
const HeaderTemplate = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  margin-top: 3vh;
  a {
    font-size: 1.5em;
  }
`;

export const HomePage = () => {
  const { addCancelable, setReqIds, reqIds } = useToaster();
  const dispatch = useAppDispatch();
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const [tiers, setTiers] = useState<Tier[][] | null>();
  const [usersTiers, setUsersTiers] = useState<UserTier[][] | null>();
  const [topUsers, setTopUsers] = useState<TopUsers[] | null>(null);
  const getTiers = useCallback(() => {
    getAllTiers().then((res) => {
      const partedArray = partArray(res, 8);
      setTiers(partedArray);
    });
    getUsersTiers().then((res) => {
      const partedArray = partArray(res, 4);
      setUsersTiers(partedArray);
    });
    getTopUsers().then((res) => {
      setTopUsers(res);
    });
  }, []);

  useEffect(() => {
    getTiers();
  }, [getTiers]);

  const delTier = (tierId: string) => {
    if (currentUser)
      try {
        setReqIds((prev) => [...prev, tierId]);
        const { request, cancel, resume, pause } = TimeoutRequest(() =>
          DeleteTier(tierId, currentUser.id).then(() => getTiers())
        );
        addCancelable(cancel, resume, pause);
        request.finally(() =>
          setReqIds((prev) => prev.filter((id) => id !== tierId))
        );
      } catch (error) {
        dispatch(setMessage(error));
      }
  };
  return (
    <>
      <IntroText>
        Оценивай игры с помощью градации в виде таблицы!
        <p>
          Выбери любой шаблон и выставляй игры от лучшего к худшему на свое
          усмотрение.
        </p>
      </IntroText>
      <div>
        <HeaderTemplate>
          <h1>Шаблоны по видеоиграм</h1>
          <Link to={"/all"}>Увидеть все шаблоны</Link>
        </HeaderTemplate>
        <CarouselWrapper arrows infinite={false} dots={false}>
          {!tiers && (
            <div>
              <div style={{ display: "flex" }}>
                {SkeletonFactory(12, "Card")}
              </div>
            </div>
          )}
          {tiers?.map((part) => (
            <div key={uuid4()}>
              <ContainerTemplateItems>
                {part.map((tier) => (
                  <TemplateCard
                    key={tier.id}
                    img={tier.imageSrc ?? ""}
                    name={tier.title}
                    id={tier.id}
                    del={tier.author_id === currentUser?.id && delTier}
                    disable={reqIds.includes(tier.id)}
                  />
                ))}
              </ContainerTemplateItems>
            </div>
          ))}
        </CarouselWrapper>
      </div>
      <div>
        <HeaderTemplate>
          <h1>Шаблоны других пользователей</h1>
        </HeaderTemplate>
        <CarouselWrapper arrows infinite={false} dots={false}>
          {!usersTiers && (
            <div>
              <div style={{ display: "flex" }}>
                {SkeletonFactory(12, "Card")}
              </div>
            </div>
          )}
          {usersTiers?.map((part) => (
            <div key={uuid4()}>
              <ContainerUsersTemplateItems>
                {part.map((tier) => (
                  <UserTemplateCard
                    key={uuid4()}
                    img={tier.present_image ?? ""}
                    name={tier.tier.title}
                    username={tier.user.name}
                    userid={tier.user.id}
                    id={tier.tier.id}
                    userImage={tier.user.image}
                  />
                ))}
              </ContainerUsersTemplateItems>
            </div>
          ))}
        </CarouselWrapper>
      </div>
      <div>
        <HeaderTemplate>
          <h1>Рекорды по пройденным играм</h1>
        </HeaderTemplate>
        <CarouselWrapper arrows infinite={false} dots={false} draggable={false}>
          {!topUsers && (
            <div>
              <div style={{ display: "flex" }}>
                {SkeletonFactory(12, "Card")}
              </div>
            </div>
          )}
          <div>
            <ContainerTopUsersItems>
              {topUsers?.map((e) => (
                <UserCard user={e} key={e.id} />
              ))}
            </ContainerTopUsersItems>
          </div>
        </CarouselWrapper>
      </div>
    </>
  );
};
