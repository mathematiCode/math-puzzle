import { Button, Tooltip } from 'antd';

function IconButtonWithTooltip({ children, text }) {
  return (
    <Tooltip placement="bottom" title={text}>
      <Button>{children}</Button>
    </Tooltip>
  );
}

export default IconButtonWithTooltip;
