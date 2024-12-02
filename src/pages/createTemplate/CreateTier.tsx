import {
  Button,
  Carousel,
  ColorPicker,
  FloatButton,
  Form,
  Input,
  Pagination,
  Table,
} from "antd";
import { TemplateCard } from "../../components/templateCard/TemplateCard";
import uuid4 from "uuid4";
import { createRef, RefObject, useCallback, useEffect, useState } from "react";
import Column from "antd/es/table/Column";
import { EyeOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Filter } from "../../components/filter/Filter";
import styled from "styled-components";
import { CarouselRef } from "antd/es/carousel";
import { FilterFlags } from "../../interfaces/filters";
import { DEFAULT_PAGE } from "../../utils/constans";
import { CardGame } from "../../components/card/CardGame";
import { gamesRequest } from "../../axios";
import { IGame } from "../../interfaces/games";
import { SkeletonFactory } from "../../utils/skeleton/skeleton-factory";
import Search from "antd/es/input/Search";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { toggleGameSelection } from "../../redux/slice/createTemplateSlice";
import { useForm } from "antd/es/form/Form";
import { ExampleTierPage } from "./ExampleTierPage";
import { AggregationColor } from "antd/es/color-picker/color";
import { UploadTier } from "../../axios/index";
import { setMessage } from "../../redux/slice/messageSlice";
import { AxiosError } from "axios";
import { ErrorAuth } from "../../redux/slice/authSlice";
const StyledForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 0;
  }
  .ant-table {
    background: none;
  }
`;
const HeaderButton = styled.button<{ $isActive: boolean }>`
  border: none;
  background: none;
  cursor: pointer;
  color: ${(props) => (props.$isActive ? "black" : "grey")};
`;
const DEFAULT_ROWS = {
  rows: [
    { id: "0", name: "Идеально", color: "#1677FF" },
    { id: "1", name: "Супер", color: "#1677FF" },
    { id: "2", name: "Отлично", color: "#1677FF" },
    { id: "3", name: "Неинтересно", color: "#1677FF" },
    { id: "4", name: "Ужасно", color: "#1677FF" },
  ],
};
export const CreateTierPage = () => {
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const [tierInfo, setTierInfo] = useState({
    name: "Ваш шаблон",
    img: "",
  });
  const [visibleForm, setVisibleForm] = useState(true);
  const createTemlate = useAppSelector((state) => state.createTemplate);
  const carouselRef: RefObject<CarouselRef> = createRef<CarouselRef>();
  const [activeButton, setActiveButton] = useState("filter");
  const [totalCount, setTotalCount] = useState<number>(1);
  const [loadingGames, setLoadingGames] = useState(true);
  const [formValues, setFormValues] = useState({
    rows: DEFAULT_ROWS.rows,
    name: "",
    img: "",
  });
  const [filterFlags, setFilterFlags] = useState({
    page: DEFAULT_PAGE,
    page_size: 10,
  });
  const [games, setGames] = useState<IGame[]>();
  const dispatch = useAppDispatch();
  const [form] = useForm();

  const handleChangeFiters = (
    param: keyof FilterFlags,
    value: string | string[] | number | null
  ) => {
    setFilterFlags((prevFlags) => ({
      ...prevFlags,
      [param]: value,
    }));
  };
  const getGames = useCallback(async () => {
    setLoadingGames(true);

    const response = await gamesRequest({
      ...filterFlags,
    });
    setGames(response.data.results);
    setTotalCount(response.data.count);
    setLoadingGames(false);
  }, [filterFlags]);
  useEffect(() => {
    getGames();
  }, [getGames]);
  const saveChangeValues = (_changedValue: unknown, e: unknown) => {
    const value = e as {
      rows: { id: string; name: string; color: AggregationColor | string }[];
      name: string;
      img: string;
    };
    setFormValues({
      rows: value.rows.map((row) => ({
        ...row,
        color:
          typeof row.color === "object" ? row.color.toHexString() : row.color,
      })),
      name: value.name,
      img: value.img,
    });
  };
  const finishForm = async () => {
    if (!currentUser) return;
    try {
      const result = await UploadTier({
        author_id: currentUser.id,
        title: formValues.name,
        rows: formValues.rows,
        filters: createTemlate.filters,
        imageSrc: formValues.img,
        pickGame: createTemlate.pickGame.map((e) => e.id),
      });
      dispatch(
        setMessage({
          success: result.data.message,
        })
      );
    } catch (e) {
      const error = e as AxiosError;
      const message = error.response?.data as ErrorAuth;
      dispatch(setMessage({ error: message.error[0].msg }));
    }
  };
  function handleKeyDown(event : any) {
    if ((event as KeyboardEvent).key === "Enter") {
      event.preventDefault();
    }
  }
  return (
    <div>
      <StyledForm
        onKeyDown={handleKeyDown}
        form={form}
        initialValues={DEFAULT_ROWS}
        onSubmitCapture={finishForm}
        onValuesChange={saveChangeValues}
        style={{ display: visibleForm ? "block" : "none" }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginTop: "1vw",
          }}
        >
          <Form.Item shouldUpdate>
            {() => (
              <Button
                htmlType="submit"
                disabled={
                  form.getFieldsError().some(({ errors }) => errors.length) ||
                  !form.isFieldsTouched()
                }
              >
                Сохранить
              </Button>
            )}
          </Form.Item>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "1vw",
            margin: "5vh 0",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "1vh" }}>
            <Form.Item
              name={"name"}
              rules={[
                {
                  required: true,
                  message: "Введите название шаблона",
                },
              ]}
            >
              <Input
                placeholder="Название шаблона"
                onChange={(e) =>
                  setTierInfo((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </Form.Item>
            <Form.Item
              name="img"
              rules={[
                {
                  required: true,
                  message: "Введите Url-ссылку на картинку",
                },
              ]}
            >
              <Input
                placeholder="Url-ссылка на картинку"
                onChange={(e) =>
                  setTierInfo((prev) => ({ ...prev, img: e.target.value }))
                }
              />
            </Form.Item>
          </div>
          <div style={{ width: "10%" }}>
            <TemplateCard
              key={uuid4()}
              img={tierInfo.img}
              name={tierInfo.name}
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: "1vw",
            justifyContent: "space-around",
          }}
        >
          <div style={{ width: "50%" }}>
            <h1 style={{ marginLeft: "1%" }}>Строки таблицы</h1>
            <Form.List name={"rows"}>
              {(rows, { add, remove }) => {
                return (
                  <Table
                    dataSource={rows}
                    pagination={false}
                    footer={() => {
                      return (
                        <Form.Item>
                          <Button
                            type="text"
                            onClick={() =>
                              add({ color: "#1677FF", id: uuid4() })
                            }
                          >
                            <PlusOutlined /> Добавить строку
                          </Button>
                        </Form.Item>
                      );
                    }}
                  >
                    <Column
                      dataIndex={"name"}
                      title={"Название"}
                      onCell={() => ({ style: { padding: "1vh 1vw" } })}
                      render={(_value, _row, index) => {
                        return (
                          <Form.Item name={[index, "name"]}>
                            <Input placeholder="Название строки" />
                          </Form.Item>
                        );
                      }}
                    />
                    <Column
                      dataIndex={"color"}
                      title={"Цвет"}
                      onCell={() => ({ style: { padding: "0 1vw" } })}
                      render={(_value, _row, index) => {
                        return (
                          <Form.Item name={[index, "color"]} shouldUpdate>
                            <ColorPicker
                              onChange={(color) =>
                                form.setFieldValue(
                                  ["rows", index, "color"],
                                  color.toHexString()
                                )
                              }
                            />
                          </Form.Item>
                        );
                      }}
                    />
                    <Column
                      title={"Взаимодействие"}
                      onCell={() => ({ style: { padding: "0 1vw" } })}
                      render={(_, row) => {
                        return (
                          <Button
                            icon={<MinusOutlined />}
                            shape={"circle"}
                            onClick={() => remove(row.name)}
                          />
                        );
                      }}
                    />
                  </Table>
                );
              }}
            </Form.List>
          </div>
          <div>
            <div style={{ display: "flex", gap: "1vw" }}>
              <HeaderButton
                type="button"
                $isActive={activeButton === "filter"}
                onClick={() => {
                  setActiveButton("filter");
                  carouselRef.current?.goTo(0);
                }}
              >
                <h1 style={{ marginBottom: "1vh" }}>Фильтры к играм</h1>
              </HeaderButton>
              <HeaderButton
                type="button"
                $isActive={activeButton === "ownGames"}
                onClick={() => {
                  setActiveButton("ownGames");
                  carouselRef.current?.goTo(1);
                }}
              >
                <h1 style={{ marginBottom: "1vh" }}>Свои игры</h1>
              </HeaderButton>
            </div>
            <Carousel
              infinite={false}
              dots={false}
              style={{ width: "31vw" }}
              ref={carouselRef}
            >
              <Form.Item name={"filter"}>
                <Filter handleChangeFiters={handleChangeFiters} />
              </Form.Item>
              <Form.Item name={"pickGame"}>
                <div>
                  <Search
                    placeholder="Введите название игры"
                    size="large"
                    onSearch={(value) => {
                      handleChangeFiters("page", 1);
                      handleChangeFiters("search", value);
                    }}
                  />
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: " repeat(auto-fill,130px)",
                      gap: ".1rem",
                      marginTop: ".25vh",
                    }}
                  >
                    {loadingGames
                      ? SkeletonFactory(filterFlags.page_size, "Card-small")
                      : games?.map((game) => {
                          return (
                            <CardGame
                              key={game.id}
                              game={{
                                ...game,
                                disabled: !createTemlate.pickGame.find(
                                  (pickGame) => pickGame.id === game.id
                                ),
                              }}
                              id={game.id}
                              size="small"
                              onCardClick={() =>
                                dispatch(toggleGameSelection(game))
                              }
                            />
                          );
                        })}
                  </div>
                  <Pagination
                    style={{ marginTop: "1vw" }}
                    defaultCurrent={1}
                    defaultPageSize={10}
                    total={totalCount}
                    onChange={(page, pageSize) => {
                      handleChangeFiters("page", page);
                      handleChangeFiters("page_size", pageSize);
                    }}
                    pageSizeOptions={[10]}
                  />
                </div>
              </Form.Item>
            </Carousel>
          </div>
        </div>
      </StyledForm>
      <div style={{ display: visibleForm ? "none" : "block" }}>
        <ExampleTierPage formValues={formValues} />
      </div>
      <FloatButton
        style={{ zIndex: 5 }}
        icon={<EyeOutlined />}
        tooltip={<div>Посмотреть на шаблон</div>}
        onClick={() => setVisibleForm(!visibleForm)}
      />
    </div>
  );
};
//9дать возможность его редактировать в будущем
