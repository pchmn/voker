import { VoteValue, Voting } from '@core/useFirebase/models';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FlexLayout } from 'la-danze-ui';
import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { useStore } from 'react-hookstore';
import { useTranslation } from 'react-i18next';

Chart.plugins.register(ChartDataLabels);

const options = {
  tooltips: {
    enabled: false
  },
  plugins: {
    datalabels: {
      formatter: (_value: any, ctx: any) => {
        return ctx.chart.data.labels[ctx.dataIndex];
      },
      color: '#fff',
      font: {
        weight: 600,
        size: 18
      }
    }
  }
};

const backgroundColors: { [key: number]: string } = {
  0: '#E91E63',
  0.5: '#9C27B0',
  1: '#673AB7',
  2: '#3F51B5',
  3: '#2196F3',
  5: '#00BCD4',
  8: '#009688',
  13: '#4CAF50',
  20: '#FF9800',
  40: '#795548',
  100: '#607D8B'
};

class DataSet {
  labels: number[] = [];
  datasets: { data: number[]; backgroundColor: string[]; hoverBackgroundColor?: string[] }[] = [
    {
      data: [],
      backgroundColor: []
    }
  ];
}

export function VotingChart(): JSX.Element {
  const { t } = useTranslation();
  const [currentVoting] = useStore<Voting>('currentVoting');
  const [dataSet, setDataSet] = useState(new DataSet());
  const [average, setAverage] = useState<number>(0);

  useEffect(() => {
    if (currentVoting) {
      setDataSet(generateDataSet(currentVoting));
    }
  }, [currentVoting]);

  useEffect(() => {
    if (dataSet.labels.length > 0) {
      calculateAverage();
    }
  }, [dataSet]);

  const calculateAverage = () => {
    let sum = 0;
    let count = 0;
    dataSet.labels.forEach((item, index) => {
      sum += (item as number) * dataSet.datasets[0].data[index];
      count += dataSet.datasets[0].data[index];
    });
    setAverage(Math.round((sum / count) * 100) / 100);
  };

  return (
    <FlexLayout flexDirection="column" alignItems="center" justifyContent="center">
      {dataSet.labels.length > 0 && <Pie data={dataSet} options={options} />}
      {average !== 0 ? (
        <span style={{ marginTop: '1rem' }}>
          {t('room.votingChart.average')}: <strong>{average}</strong>
        </span>
      ) : (
        <span>{t('room.votingChart.noVote')}</span>
      )}
    </FlexLayout>
  );
}

function generateDataSet(voting: Voting): DataSet {
  const dataSet = new DataSet();
  const voteValueList: VoteValue[] = [];

  for (const key in voting.votes) {
    const voteValue = voting.votes[key];
    if (voteValue !== undefined && typeof voteValue === 'number') {
      if (!dataSet.labels.includes(voteValue as number)) {
        dataSet.labels.push(voteValue as number);
      }
      voteValueList.push(voteValue);
    }
  }

  for (const voteValue of dataSet.labels) {
    dataSet.datasets[0].data.push(voteValueList.filter((item) => voteValue === item).length);
    dataSet.datasets[0].backgroundColor.push(backgroundColors[voteValue]);
  }
  dataSet.datasets[0].hoverBackgroundColor = [...dataSet.datasets[0].backgroundColor];

  return dataSet;
}
