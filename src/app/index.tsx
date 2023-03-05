import {Game} from '@app/puzzle'

export const App = () => {
  return (
    <div className="flex flex-col flex-1 bg-stone-600">
      <div className="flex flex-col items-center justify-center flex-1">
        <Game />
      </div>
    </div>
  )
}
