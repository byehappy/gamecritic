import { useEffect, useState } from "react";
import instance from "../axios";
import {
  Button,
  Pagination,
  PaginationProps,
  Row,
  TreeSelectProps,
} from "antd";
import { IGame } from "../interfaces/games";
import Search from "antd/es/input/Search";
import { CardList } from "../components/cardList/CardList";
import { FilterOutlined } from "@ant-design/icons";
import { Filter } from "../components/filter/Filter";
import { RangePickerProps } from "antd/es/date-picker";
import { TierTable } from "../components/tierTable/TierTable";

function MainPage() {
  const [games, setGames] = useState<IGame[]>();
  const [searchValue, setSearchValue] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<string[]>();
  const [genres, setGenres] = useState<string[] | null>();
  const [tags, setTags] = useState<string[] | null>();
  const { instanceGames } = instance;
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(40);
  const [totalCount, setTotalCount] = useState<number>(1);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const getGames = () => {
    setLoading(true);
    return instanceGames
      .get("", {
        params: {
          search: searchValue,
          dates:
            date?.some((item) => item === "") || date === undefined
              ? null
              : `${date[0]},${date[1]}`,
          genres: !genres || genres.length === 0 ? null : genres.join(","),
          tags: !tags || tags.length === 0 ? null : tags.join(","),
          page: page,
          page_size:pageSize
        },
      })
      .then((res) => {
        setGames(res.data.results);
        setTotalCount(res.data.count);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error.toJSON());
        setLoading(false);
      });
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      getGames();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchValue, date, genres, tags, page,pageSize]);

  const handleSearch = (value: string) => {
    setSearchValue(value.trim());
  };

  const handleDateChange: RangePickerProps["onChange"] = (_, dateString) => {
    setDate(dateString);
  };
  const handleGenresChange: TreeSelectProps["onChange"] = (value) => {
    setGenres(value);
  };
  const handleTagsChange: TreeSelectProps["onChange"] = (value) => {
    setTags(value);
  };
  const handlePagination: PaginationProps["onChange"] = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize)
  };
  return (
    <>
      <TierTable />
      <div style={{ display: "flex", gap: "1vh", marginTop: "2vh" }}>
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
      <Row
        gutter={[6, 16]}
        style={{
          marginTop: "2vh",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {loading ? (
          <CardList loading={loading} pageSize={pageSize}/>
        ) : (
          <CardList games={games} loading={loading} />
        )}
      </Row>
      <Filter
        onClose={onClose}
        open={open}
        handleDateChange={handleDateChange}
        handleGenresChange={handleGenresChange}
        handleTagsChange={handleTagsChange}
      />
      <div style={{ margin: "4vh 0" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Pagination
            defaultCurrent={1}
            defaultPageSize={40}
            total={totalCount}
            onChange={handlePagination}
            pageSizeOptions={[10,20,30,40]}
          />
        </div>
      </div>
    </>
  );
}

export default MainPage;
