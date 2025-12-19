import React from 'react'
import AppHead from './_components/AppHead';

function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
        <AppHead/>
        {children}
    </div>
  )
}

export default DashboardLayout