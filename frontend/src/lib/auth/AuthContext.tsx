'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, AuthResponse, LoginRequest, RegisterRequest } from '@/types'
import { apiClient } from '@/lib/api/client'
import { toast } from 'sonner'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in on mount
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken')
      if (!accessToken) {
        setIsLoading(false)
        return
      }

      const userData = await apiClient.get<User>('/users/me')
      setUser(userData)
    } catch (error) {
      console.error('Auth check failed:', error)
      apiClient.clearTokens()
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials)
      
      apiClient.setTokens(response.accessToken, response.refreshToken)
      setUser(response.user)
      
      toast.success('Login successful!')
      
      // Redirect based on role
      redirectBasedOnRole(response.user.role)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed')
      throw error
    }
  }

  const register = async (data: RegisterRequest) => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', data)
      
      apiClient.setTokens(response.accessToken, response.refreshToken)
      setUser(response.user)
      
      toast.success('Registration successful!')
      
      // Redirect based on role
      redirectBasedOnRole(response.user.role)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed')
      throw error
    }
  }

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      apiClient.clearTokens()
      setUser(null)
      toast.success('Logged out successfully')
      router.push('/auth/login')
    }
  }

  const refreshUser = async () => {
    try {
      const userData = await apiClient.get<User>('/users/me')
      setUser(userData)
    } catch (error) {
      console.error('Failed to refresh user:', error)
    }
  }

  const redirectBasedOnRole = (role: string) => {
    switch (role) {
      case 'super_admin':
        router.push('/admin/dashboard')
        break
      case 'school_admin':
        router.push('/admin/dashboard')
        break
      case 'teacher':
        router.push('/teacher/dashboard')
        break
      case 'student':
        router.push('/student/dashboard')
        break
      case 'parent':
        router.push('/parent/dashboard')
        break
      default:
        router.push('/dashboard')
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
