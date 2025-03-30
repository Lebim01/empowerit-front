const Card = ({ children, onClick }: any) => {
  return (
    <div
      className="bg-slate-100 rounded-[10px] p-4 card-border cursor-pointer user-select-none hover:shadow-lg flex flex-col space-y-2"
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export default Card
