import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import { AppProvider } from '../context/AppContext'
import LecturesList from '../features/lectures/LecturesList'

const renderWithProviders = (component) => {
  return render(
    <AppProvider>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </AppProvider>
  )
}

describe('Lectures Module', () => {
  it('renders the lectures page title', () => {
    renderWithProviders(<LecturesList />)
    expect(screen.getByText('Lectures')).toBeInTheDocument()
    expect(screen.getByText('Explore system design concepts through interactive lectures')).toBeInTheDocument()
  })

  it('displays add lecture button', () => {
    renderWithProviders(<LecturesList />)
    expect(screen.getByText('Add Lecture')).toBeInTheDocument()
  })

  it('shows default lectures', () => {
    renderWithProviders(<LecturesList />)
    expect(screen.getByText('Introduction to System Design')).toBeInTheDocument()
    expect(screen.getByText('Database Design and Scaling')).toBeInTheDocument()
  })
})