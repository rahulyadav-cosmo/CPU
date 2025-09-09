import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import { AppProvider } from '../context/AppContext'
import Home from '../pages/Home'

const renderWithProviders = (component) => {
  return render(
    <AppProvider>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </AppProvider>
  )
}

describe('Home Page', () => {
  it('renders the main heading', () => {
    renderWithProviders(<Home />)
    expect(screen.getByText('Master System Design')).toBeInTheDocument()
  })

  it('displays feature cards', () => {
    renderWithProviders(<Home />)
    expect(screen.getByText('Interactive Lectures')).toBeInTheDocument()
    expect(screen.getByText('Practice Quizzes')).toBeInTheDocument()
    expect(screen.getByText('Community Forum')).toBeInTheDocument()
    expect(screen.getByText('Track Progress')).toBeInTheDocument()
  })

  it('shows stats correctly', () => {
    renderWithProviders(<Home />)
    expect(screen.getByText('Total Lectures')).toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()
    expect(screen.getByText('Quizzes')).toBeInTheDocument()
    expect(screen.getByText('Discussions')).toBeInTheDocument()
  })
})