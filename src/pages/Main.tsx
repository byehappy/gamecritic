import { useEffect, useState } from "react";
import instance from "../axios";
import { Row } from "antd";
import { IGame } from "../interfaces/games";
import Search from "antd/es/input/Search";
import { CardList } from "../components/cardList/CardList";

function MainPage() {
  const [games, setGames] = useState<IGame[]>();
  const [searchValue, setSearchValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);


  const getGames = (search?: string) => {
    setLoading(true);
    return instance
      .get("", { params: { search: search } })
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
  }, [searchValue]);

  const handleSearch = (value: string) => {
    setSearchValue(value.trim());
  };

  return (
    <>
      <Search
        placeholder="Введите название игры"
        enterButton="Поиск"
        onChange={(e) => setSearchValue(e.target.value)}
        size="large"
        onSearch={handleSearch}
        loading={loading}
      />
      {loading ? <Row
          gutter={[6, 16]}
          style={{
            marginTop: "2vh",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <CardList loading={loading}/>
        </Row>
        :
        <Row
          gutter={[6, 16]}
          style={{
            marginTop: "2vh",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <CardList games={games} loading={loading}/>
        </Row>
        }
    </>
  );
}

export default MainPage;
