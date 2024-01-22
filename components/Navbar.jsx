import {
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Typography,
} from '@material-tailwind/react';
import { signOut, useSession } from 'next-auth/react';
import { HiMiniArrowRightOnRectangle } from 'react-icons/hi2';

export default function Navbar() {
  const { data, status } = useSession();

  return (
    <nav className="border-b border-gray-100 bg-white px-6">
      <div className="flex h-16 items-center justify-between md:justify-end">
        <div className="inline-flex items-center gap-6">
          <Menu placement="bottom-end" allowHover>
            <MenuHandler>
              <div className="inline-flex cursor-pointer items-center gap-1.5">
                <Typography className="font-semibold capitalize text-gray-900">
                  {status == 'loading' ? 'loading...' : data.user.fullname}
                </Typography>
              </div>
            </MenuHandler>

            <MenuList>
              <MenuItem>
                <Typography className="font-semibold text-gray-900">
                  {status == 'loading' ? 'loading...' : data.user.fullname}
                </Typography>
                <Typography className="text-sm font-medium text-gray-500">
                  {status == 'loading' ? 'loading...' : data.user.email}
                </Typography>
              </MenuItem>
              <hr className="my-3" />
              <MenuItem
                className="flex items-center gap-2 text-gray-500"
                onClick={() => {
                  if (confirm('are you sure?')) {
                    signOut();
                  }
                }}
              >
                <HiMiniArrowRightOnRectangle size={16} weight="bold" />
                <Typography className="text-sm font-medium">
                  Sign Out
                </Typography>
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </div>
    </nav>
  );
}
