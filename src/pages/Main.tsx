import { useEffect, useState } from "react";
import instance from "../axios";
import { Button, DatePicker, DatePickerProps, Drawer, Row } from "antd";
import { IGame } from "../interfaces/games";
import Search from "antd/es/input/Search";
import { CardList } from "../components/cardList/CardList";
import { FilterOutlined } from "@ant-design/icons";

function MainPage() {
  const [games, setGames] = useState<IGame[]>();
  const [searchValue, setSearchValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<string | string[]>("");

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  const getGames = (search?: string) => {
    setLoading(true);
    return instance
      .get("", { params: { search: search, dates: !date ? "":`${date[0]},${date[1]}`} })
      .then((res) => {
        setGames(res.data.results);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error.toJSON());
        setLoading(false);
      });
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      getGames(searchValue.trim());
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchValue,date]);


  const handleSearch = (value: string) => {
    setSearchValue(value.trim());
  };

  const handleDateChange: DatePickerProps["onChange"] = (
    dateObj,
    dateString
  ) => {
    setDate(dateString);
    console.log(date);
  };
  return (
    <>
      <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
        <Search
          placeholder="Введите название игры"
          enterButton="Поиск"
          onChange={(e) => setSearchValue(e.target.value)}
          size="large"
          onSearch={handleSearch}
          loading={loading}
        />
        <Button
          size="large"
          type="primary"
          onClick={showDrawer}
          icon={<FilterOutlined />}
        />
      </div>
      {loading ? (
        <Row
          gutter={[6, 16]}
          style={{
            marginTop: "2vh",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <CardList loading={loading} />
        </Row>
      ) : (
        <Row
          gutter={[6, 16]}
          style={{
            marginTop: "2vh",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <CardList games={games} loading={loading} />
        </Row>
      )}
      <Drawer title="Фильтрация" onClose={onClose} open={open}>
        Дата выхода игры:{" "}
        <DatePicker.RangePicker
          format={"YYYY-MM-DD"}
          onChange={handleDateChange}
        />
      </Drawer>
    </>
  );
}

export default MainPage;
