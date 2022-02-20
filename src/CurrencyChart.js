import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";

const CurrencyChart = ({ dataToShow }) => {
  const convertData = (d) => {
    let data = [
      {
        date: d.date,
        XAxisKey: "name",
        line1Key: "value",
        values: [],
      },
    ];

    if (d.start_date) {
      const dates = Object.keys(d.rates);
      const currencies = Object.values(d.rates);

      const result = currencies.map((item) =>
        Object.entries(item).map(([k, v]) => ({ name: k, value: v }))
      );

      const readyData = dates.map((item) => ({
        date: item,
        XAxisKey: "name",
        line1Key: "value",
        values: [],
      }));

      result.forEach((item, index) => {
        readyData[index].values = item;
      });

      data = readyData;
    } else {
      for (let key in d.rates) {
        const obj = { name: key, value: d.rates[key] };
        data[0].values.push(obj);
      }
    }

    return data;
  };

  const data = convertData(dataToShow);

  const charts = data.map((item) => (
    <SwiperSlide key={item.date}>
      <div className="chartDescription">
        <h1>Dane z dnia: {item.date}</h1>
        <h2>1 {dataToShow.base} to:</h2>
      </div>
      <ResponsiveContainer className="chart" width="90%" height={400}>
        <BarChart width={350} height={400} data={item.values}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={item.XAxisKey} />
          <YAxis />
          <Tooltip />
          <Bar dataKey={item.line1Key} fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </SwiperSlide>
  ));
  return (
    <div className="chartContainer">
      <Swiper navigation={true} modules={[Navigation]}>
        {charts}
      </Swiper>
    </div>
  );
};

export default React.memo(CurrencyChart);
