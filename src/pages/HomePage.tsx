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
  grid-template-columns: repeat(auto-fit, minmax(calc(100px + 30 * (100vw / 1280)), 1fr));
  column-gap:1vw;
  row-gap:10px;
  height: 100%;
  padding: 0 1vw;
`;
const ContainerUsersTemplateItems = styled.div`
  display: flex;
  justify-content:space-between;
  overflow:auto;
  gap: 1vw;
  height: 100%;
  padding: 0 1vw;
`;
const ContainerTopUsersItems = styled.div`
  display: flex;
  justify-content:space-between;
  gap: 1vw;
  height: 100%;
  padding: 0 1vw;
  overflow: overlay;
`;
const IntroText = styled.h1`
  display: flex;
  flex-direction: column;
  margin: 3vh 0;
  font-size: ${({ theme }) => theme.fontSizes.adaptivH1};
  p {
    margin: 1vh 0;
    font-weight: 300;
    font-size: ${({ theme }) => theme.fontSizes.adaptivText};
  }
`;
const HeaderTemplate = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 3vh;
  font-size: ${({ theme }) => theme.fontSizes.adaptivText};
  a {
    font-weight: 300;
    font-size: ${({ theme }) => theme.fontSizes.adaptivSmallText};
    text-align:right;
  }
`;

export const HomePage = () => {
  const { addCancelable, setReqIds, reqIds, delToasterTierId } = useToaster();
  const dispatch = useAppDispatch();
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const [tiers, setTiers] = useState<Tier[][] | null>();
  const [usersTiers, setUsersTiers] = useState<UserTier[][] | null>();
  const [topUsers, setTopUsers] = useState<TopUsers[] | null>(null);
  const getTiers = useCallback(() => {
    getAllTiers().then((res) => {
      const partedArray = partArray(res, 6);
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
  }, []);
  useEffect(() => {
    const intreval = setInterval(() => {
      getTiers();
    }, 30 * 1000);
    return () => clearInterval(intreval);
  }, [getTiers]);

  const delTier = (tierId: string, title: string) => {
    if (currentUser)
      try {
        setReqIds((prev) => [...prev, tierId]);
        const cancelableReq = TimeoutRequest(
          () => DeleteTier(tierId, currentUser.id).then(() => getTiers()),
          tierId
        );
        if (cancelableReq !== null) {
          addCancelable(
            cancelableReq.cancel,
            cancelableReq.resume,
            cancelableReq.pause,
            `Оменить удаление шаблона:${title}?`,
            tierId
          );
          cancelableReq.request.finally(() =>
            setReqIds((prev) => prev.filter((id) => id !== tierId))
          );
        } else {
          delToasterTierId(tierId);
        }
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
          Шаблоны по видеоиграм
          <Link to={"/all"}>Увидеть все шаблоны</Link>
        </HeaderTemplate>
        <CarouselWrapper arrows infinite={false} dots={false} swipe={false}>
          {!tiers && (
            <div>
              <ContainerTemplateItems>
                {SkeletonFactory(6, "Template")}
              </ContainerTemplateItems>
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
        <HeaderTemplate>Шаблоны других пользователей</HeaderTemplate>
        <CarouselWrapper arrows infinite={false} dots={false} swipe={false}>
          {!usersTiers && (
            <div>
              <ContainerUsersTemplateItems>
                {SkeletonFactory(4, "Template")}
              </ContainerUsersTemplateItems>
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
        <HeaderTemplate>Рекорды по пройденным играм</HeaderTemplate>
        <CarouselWrapper arrows infinite={false} dots={false} draggable={false} swipe={false}>
          {!topUsers && (
            <div>
              <div style={{ display: "flex" }}>
                {SkeletonFactory(10, "Card")}
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
