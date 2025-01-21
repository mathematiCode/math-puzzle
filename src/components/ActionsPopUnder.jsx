/* eslint-disable react/prop-types */
import { Button, Tooltip } from 'antd';
import { RotateRightOutlined } from '@ant-design/icons';

function ActionsPopUnder({ text }) {
  return (
    <Tooltip placement="bottom" title={text}>
      <Button>
        {' '}
        Rotate
        <RotateRightOutlined style={{ fontSize: '30px' }} />
      </Button>
    </Tooltip>
  );
}

export default ActionsPopUnder;
