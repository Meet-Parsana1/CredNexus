import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/services/auth.service';

export async function POST(request: NextRequest) {
  try {
    const { action, email, role } = await request.json();

    if (action === 'login') {
      const user = AuthService.getDefaultUser();
      return NextResponse.json({
        success: true,
        user: {
          ...user,
          email: email || user.email,
          name: role === 'admin' ? 'Priya Sharma (Scheme Officer)' : user.name,
        },
        role: role || 'user',
      });
    }

    if (action === 'logout') {
      return NextResponse.json({ success: true, message: 'Logged out successfully' });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
