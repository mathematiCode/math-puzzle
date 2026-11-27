import { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  fetchCompletionAnalytics,
  type CompletionAnalytics,
  type LevelCompletionStat,
} from '../lib/api';
import { getLevelIds } from '../Game/utils/getLevelsArray';

type Status = 'loading' | 'ready' | 'error';

/** A level's display position plus its stats, resolved by stable level id. */
type LevelRow = {
  displayNumber: number; // 1-based position in the current level order
  levelId: number; // stable id (levels.json `id`)
  stats: LevelCompletionStat;
};

/**
 * Secret (unlisted) analytics page — issue #89.
 *
 * Shows, across all anonymous players, how many have started and completed each
 * level and the average number of moves it took to solve it. Reachable only by
 * knowing the URL; it is not linked from the nav anywhere.
 */
function Secret() {
  const [status, setStatus] = useState<Status>('loading');
  const [data, setData] = useState<CompletionAnalytics | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchCompletionAnalytics()
      .then(result => {
        if (!cancelled) {
          setData(result);
          setStatus('ready');
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Drive the table off the current level order (levels.json), and merge in the
  // server stats by *stable level id* — so reordering/inserting levels keeps the
  // numbers attached to the right level (issue #105). Levels nobody has touched
  // still show, with zeros.
  const statsByLevelId = new Map<number, LevelCompletionStat>(
    (data?.levels ?? []).map(stat => [stat.level_id, stat])
  );
  const rows: LevelRow[] = getLevelIds().map((levelId, index) => ({
    displayNumber: index + 1,
    levelId,
    stats: statsByLevelId.get(levelId) ?? {
      level_id: levelId,
      started_count: 0,
      completed_count: 0,
      avg_moves_to_complete: null,
    },
  }));

  const maxStarted = Math.max(1, ...rows.map(r => r.stats.started_count));
  const totalCompletions = rows.reduce(
    (sum, r) => sum + r.stats.completed_count,
    0
  );

  return (
    <Page>
      <Header>
        <Title>Level Analytics</Title>
        <Subtitle>
          How many players reach and solve each level — and how many moves it
          takes them.
        </Subtitle>
      </Header>

      {status === 'loading' && <Note>Loading analytics…</Note>}
      {status === 'error' && (
        <Note $error>
          Couldn’t load analytics. Make sure the backend is running and
          reachable.
        </Note>
      )}

      {status === 'ready' && data && (
        <>
          <TilesRow>
            <Tile>
              <TileValue>{data.total_players}</TileValue>
              <TileLabel>Total players</TileLabel>
            </Tile>
            <Tile>
              <TileValue>{totalCompletions}</TileValue>
              <TileLabel>Level completions</TileLabel>
            </Tile>
            <Tile>
              <TileValue>{rows.length}</TileValue>
              <TileLabel>Levels</TileLabel>
            </Tile>
          </TilesRow>

          <Legend>
            <LegendItem>
              <Swatch $kind="started" /> Started
            </LegendItem>
            <LegendItem>
              <Swatch $kind="completed" /> Completed
            </LegendItem>
          </Legend>

          <Chart>
            <HeaderRow>
              <LevelLabel>Level</LevelLabel>
              <BarArea>
                <HeaderHint>Completed / Started</HeaderHint>
              </BarArea>
              <Moves>Avg moves</Moves>
            </HeaderRow>
            {rows.map(({ displayNumber, levelId, stats }) => {
              const completionRate =
                stats.started_count > 0
                  ? Math.round(
                      (stats.completed_count / stats.started_count) * 100
                    )
                  : 0;
              return (
                <Row key={levelId}>
                  <LevelLabel>
                    Level {displayNumber}
                    <LevelId>ID {levelId}</LevelId>
                  </LevelLabel>
                  <BarArea>
                    <StartedBar
                      style={{
                        width: `${(stats.started_count / maxStarted) * 100}%`,
                      }}
                    >
                      <CompletedBar
                        style={{
                          width: stats.started_count
                            ? `${
                                (stats.completed_count / stats.started_count) *
                                100
                              }%`
                            : '0%',
                        }}
                      />
                    </StartedBar>
                    <Counts>
                      {stats.completed_count}/{stats.started_count}
                      {stats.started_count > 0 && ` · ${completionRate}%`}
                    </Counts>
                  </BarArea>
                  <Moves>
                    {stats.avg_moves_to_complete != null
                      ? `${stats.avg_moves_to_complete} avg moves`
                      : '—'}
                  </Moves>
                </Row>
              );
            })}
          </Chart>
        </>
      )}
    </Page>
  );
}

export default Secret;

const TEAL = '#007571';
const TEAL_LIGHT = '#bfe3e1';

const Page = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 20px 64px;
  text-align: left;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 32px;
`;

const Title = styled.h1`
  color: ${TEAL};
  font-size: 2.5rem;
  margin: 0 0 8px;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 1.05rem;
  max-width: 560px;
  margin: 0 auto;
  line-height: 1.5;
`;

const Note = styled.p<{ $error?: boolean }>`
  text-align: center;
  color: ${props => (props.$error ? '#b00020' : '#666')};
  font-size: 1.05rem;
  margin-top: 40px;
`;

const TilesRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 32px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const Tile = styled.div`
  background: white;
  border-radius: 12px;
  border-left: 5px solid ${TEAL};
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  padding: 20px;
  text-align: center;
`;

const TileValue = styled.div`
  color: ${TEAL};
  font-size: 2.2rem;
  font-weight: 700;
  line-height: 1;
`;

const TileLabel = styled.div`
  color: #777;
  font-size: 0.9rem;
  margin-top: 6px;
`;

const Legend = styled.div`
  display: flex;
  gap: 24px;
  justify-content: center;
  margin-bottom: 16px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #555;
  font-size: 0.9rem;
`;

const Swatch = styled.span<{ $kind: 'started' | 'completed' }>`
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 3px;
  background: ${props => (props.$kind === 'completed' ? TEAL : TEAL_LIGHT)};
`;

const Chart = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 72px 1fr 110px;
  align-items: center;
  gap: 12px;

  @media (max-width: 560px) {
    grid-template-columns: 56px 1fr;
    row-gap: 2px;
  }
`;

const HeaderRow = styled.div`
  display: grid;
  grid-template-columns: 72px 1fr 110px;
  align-items: center;
  gap: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #9aa;

  @media (max-width: 560px) {
    display: none;
  }
`;

const HeaderHint = styled.span`
  font-size: 0.72rem;
  color: #9aa;
`;

const LevelLabel = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
  font-weight: 600;
  color: #444;
`;

const LevelId = styled.span`
  font-size: 0.72rem;
  font-weight: 500;
  color: #9aa;
  letter-spacing: 0.02em;
`;

const BarArea = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const StartedBar = styled.div`
  position: relative;
  height: 22px;
  min-width: 2px;
  background: ${TEAL_LIGHT};
  border-radius: 6px;
  transition: width 0.4s ease;
`;

const CompletedBar = styled.div`
  position: absolute;
  inset: 0 auto 0 0;
  height: 100%;
  background: ${TEAL};
  border-radius: 6px;
  transition: width 0.4s ease;
`;

const Counts = styled.span`
  font-size: 0.82rem;
  color: #666;
  white-space: nowrap;
`;

const Moves = styled.div`
  font-size: 0.85rem;
  color: ${TEAL};
  font-weight: 600;
  text-align: right;

  @media (max-width: 560px) {
    grid-column: 2;
    text-align: left;
  }
`;
