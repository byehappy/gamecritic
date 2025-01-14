import { Link } from "react-router-dom";
import styled from "styled-components";
import { TemplateCard } from "../components/templateCard/TemplateCard";
import { useCallback, useEffect, useState } from "react";
import {
  DeleteTier,
  getPreviewTiers,
  getTopUsers,
  getUsersTiers,
} from "../axios";
import uuid4 from "uuid4";
import { SkeletonFactory } from "../utils/skeleton/skeleton-factory";
import { UserTemplateCard } from "../components/userTemplateCard/UserTemplateCard";
import { UserCard } from "../components/userCard/UserCard";
import { TopUsers } from "../axios/requests/gamecriticAPI/passGame.request";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setMessage } from "../redux/slice/messageSlice";
import { TimeoutRequest } from "../utils/cancelableReq";
import { useToaster } from "../utils/hooks/useToaster";
import { device } from "../styles/size";
import {
  Tier,
  UserTier,
} from "../axios/requests/gamecriticAPI/tierData.requests";

const ContainerTemplateItems = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 2%;
  padding: 0 1vw;
  margin: 2% 0;
  @media ${device.mobileS} {
    height: 150px;
    div {
      min-width: 200px;
      max-width: 200px;
    }
  }
  @media ${device.tablet} {
    height: 24vh;
  }
  @media ${device.laptop} {
    overflow-x: unset;
    div {
      width: 15%;
      min-width: 15%;
    }
  }
`;
const ContainerUsersTemplateItems = styled.div`
  display: flex;
  overflow: auto;
  gap: 1.3%;
  height: 100%;
  padding: 0 1vw;
  margin: 2% 0;
  min-height: 150px;
  div {
    min-width: 225px;
  }
  @media (min-width: 768px) {
    min-height: 200px;
  }
  @media ${device.laptop} {
    overflow-x: unset;
    div {
      width: 24%;
    }
  }
`;
const ContainerTopUsersItems = styled.div`
  display: flex;
  padding: 0 1vw;
  gap:2vw;
  margin: 2% 0;
  overflow-x: auto;
  position:relative;
  @media ${device.laptop} {
    overflow-y: visible;
    overflow-x: clip;
  }
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
    text-align: right;
    text-decoration:underline;
  }
`;

export const HomePage = () => {
  const { addCancelable, setReqIds, reqIds, delToasterTierId } = useToaster();
  const dispatch = useAppDispatch();
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const [tiers, setTiers] = useState<Tier[] | null>();
  const [usersTiers, setUsersTiers] = useState<UserTier[] | null>();
  const [topUsers, setTopUsers] = useState<TopUsers[] | null>(null);
  const getTiers = useCallback(() => {
    getPreviewTiers().then((res) => {
      setTiers(res);
    });
    getUsersTiers().then((res) => {
      setUsersTiers(res);
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
            `Отменить удаление шаблона:${title}?`,
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
          <h4>Шаблоны по видеоиграм</h4>
          <Link to={"/all"}>Увидеть все шаблоны</Link>
        </HeaderTemplate>
        {!tiers && (
          <ContainerTemplateItems>
            {SkeletonFactory(6, "Template")}
          </ContainerTemplateItems>
        )}
        {tiers && (
          <ContainerTemplateItems>
            {tiers.map((tier) => (
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
        )}
      </div>
      <div>
        <HeaderTemplate>
          <h4>Шаблоны других пользователей</h4>
        </HeaderTemplate>
        {!usersTiers && (
          <div>
            <ContainerUsersTemplateItems>
              {SkeletonFactory(4, "Template")}
            </ContainerUsersTemplateItems>
          </div>
        )}
        {usersTiers && (
          <ContainerUsersTemplateItems>
            {usersTiers.map((tier) => (
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
        )}
      </div>
      <div>
        <HeaderTemplate>
          <h4>Рекорды по пройденным играм</h4>
        </HeaderTemplate>
        {!topUsers && (
          <ContainerTopUsersItems>
            {SkeletonFactory(10, "Card")}
          </ContainerTopUsersItems>
        )}
        {topUsers && (
          <ContainerTopUsersItems>
            {topUsers?.map((e,index) => (
              <UserCard user={e} key={e.id} first={index === 0}/>
            ))}
          </ContainerTopUsersItems>
        )}
      </div>
    </>
  );
};
