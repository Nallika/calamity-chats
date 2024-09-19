import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import logo from '../../images/logo.svg'
import Card from '../ui/card/card';

const Header = () => {
  return (
    <Card className="pb-0">
      <header className="grid grid-cols-[1fr,auto,1fr] items-center">
        <div></div>
        <Image src={logo} alt="Logo" width={30} height={30} />
        <Link className="justify-self-end text-primary font-semibold hover:underline" href="/">
          New chat
        </Link>
      </header>
    </Card>
  );
};

export default Header;