# react_example
Здесь представлен процесс создания/редактирования клиентом предложения из своих вагонов.
В FirstStep.js выбираются вагоны из списка доступных клиенту, выбранные записываются в activeCars в reducer.js и клиент попадает на второй этап создания SecondStep.js.
В SecondStep.js подгружаются activeCars и вся нужная информация по этим вагонам, затем задаются параметры предложения(каждого вагона отдельно или всех сразу) и создается предложение.
При редактировании происходит сразу переход на SecondStep.js.
