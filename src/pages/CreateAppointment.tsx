import React, { useState, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import Header from '../components/Header'
import Button from '../components/Button'

type RequestStatusType = 'NONE' | 'LOADING' | 'COMPLETED' | 'ERROR'

export interface IRoomInterface {
  domain: string
  name: string
  timezone: string
  // eslint-disable-next-line camelcase
  created_at: Date
  // eslint-disable-next-line camelcase
  updated_at: Date
  _id: string
  __v?: 0
}

const CreateAppointment: React.FC = () => {
  const history = useHistory()
  const [requestStatus, setRequestStatus] = useState<RequestStatusType>('NONE')
  const copyRef = useRef<HTMLInputElement | null>(null)
  const [room, setRoom] = useState<IRoomInterface>()
  const [meetLink, setMeetLink] = useState('')

  const createAppointmentAction = () => {
    const fetchData = async () => {
      setRequestStatus('LOADING')
      const url = `${import.meta.env.VITE_API_URL}/api/meet/room/create`
      try {
        const response = await fetch(url)

        if (!response.ok) throw new Error(await response.json())

        const room = await response.json()
        setRoom(room)
        const { host, protocol } = window.location
        const link = `${protocol}//${host}/patient/pre-appointment/${room.name}`
        setMeetLink(link)
        setRequestStatus('COMPLETED')
      } catch (error) {
        console.log('ERROR::::::::', error)
        setRequestStatus('ERROR')
        setMeetLink('')
      }
    }
    fetchData()
  }

  const copyLink = () => {
    if (!copyRef.current) return
    copyRef.current.select()
    document.execCommand('copy')
    alert('Link to share with the patient has copied!')
  }

  const goToPreAppointment = () => {
    history.push(`/doctor/pre-appointment/${room?.name}`)
  }

  return (
    <div
      className={`bg-white p-3 rounded-md max-w-3xl ${
        requestStatus === 'LOADING' ? 'cursor-wait' : ''
      }`}
    >
      <Header
        title="Welcome Doctor"
        subtitle="Please, type the appointment data."
      />

      <div className="flex flex-col mt-8 gap-4">
        <div className="flex justify-start items-end">
          <div>
            <label
              htmlFor="date"
              className="block text-base font-semibold text-gray-700"
            >
              Appointment
            </label>
            <input
              className="focus:ring-blue-500 focus:border-blue-500 block w-full px-2 sm:text-sm border border-gray-400 rounded-md"
              type="datetime-local"
              name="date"
              id="date"
              placeholder="Date"
            />
          </div>
          {/* <div>
            <input
              className="focus:ring-blue-500 focus:border-blue-500 block w-full px-2 sm:text-sm border-2 border-gray-400 rounded-md"
              type="datetime-local"
              name="time"
              id="time"
              placeholder="Time"
            />
          </div> */}
        </div>
        <div className="w-56">
          <Button type="button" onClick={createAppointmentAction}>
            Create Appointment
          </Button>
        </div>
        {/* alert */}
        {requestStatus === 'COMPLETED' && (
          <div
            className="w-full rounded-md filter brightness-110 mt-5
          bg-blue-100 p-3"
          >
            <div className="text-blue-300 filter brightness-75">
              <span className="font-bold text-lg">
                The appointment was created successfully!
              </span>
              <p className="font-light">
                Please, share the link below with your patient.
              </p>
            </div>
          </div>
        )}

        {requestStatus === 'ERROR' && (
          <div
            className="w-full rounded-md filter brightness-110 mt-5
          bg-red-100 p-3"
          >
            <div className="text-red-300 filter brightness-75">
              <span className="font-bold text-lg">
                Error on create a new appointment
              </span>
              <p className="font-light">Please, try again.</p>
            </div>
          </div>
        )}

        <div className="flex w-full items-center gap-6">
          <div className="relative flex items-center flex-grow">
            <input
              className="focus:ring-blue-500 focus:border-blue-500 block w-full px-2 sm:text-sm border border-gray-400 rounded-md pl-2 py-1 pr-16"
              type="text"
              name="link"
              ref={copyRef}
              readOnly
              value={meetLink}
              placeholder=""
              aria-label="Link of the appointment for patient."
            />
            <div className="absolute right-0">
              <Button type="button" aria-label="copy" onClick={copyLink}>
                Copy
              </Button>
            </div>
          </div>
          <div
            className="flex-none"
            aria-label="Go to the appointment with doctor."
          >
            <Button
              type="button"
              disabled={meetLink === ''}
              onClick={goToPreAppointment}
            >
              Go to the appointment
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateAppointment
