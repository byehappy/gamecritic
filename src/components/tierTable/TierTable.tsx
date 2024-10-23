import React, { useState } from "react";
import { Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import useToken from "antd/es/theme/useToken";

const initTier = [
  { key: "1", tier: "Идеально", games: "" },
  { key: "2", tier: "Супер", games: "" },
  { key: "3", tier: "Отлично", games: "" },
  { key: "4", tier: "Неинтересно", games: "" },
  { key: "5", tier: "Ужасно", games: "" },
];

export const TierTable = () => {
    const token = useToken()
    
  const columns: ColumnsType = [
    {
      dataIndex: "tier",
      key: "tier",
      width: "10%",
      onCell: () =>{
        return {
            style:{
                background:token[1].blue,
                color:"white",
                textAlign:"center"
            }
        }
      }
    },
    {
      dataIndex: "games",
      key: "games",
      onCell: () =>{
        return {
            style:{
                background:token[1].colorBgTextActive,
            }
        }
      },
      render: () => <div style={{ minHeight: "100px" }}></div>,
    },
  ];

  return <Table pagination={false} dataSource={initTier} columns={columns} />;
};
